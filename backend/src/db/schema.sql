-- PostgreSQL function for Arabic normalization
CREATE OR REPLACE FUNCTION normalize_arabic(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    TRIM(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(input_text, '[أإآ]', 'ا', 'g'),
          'ة', 'ه', 'g'),
        'ى', 'ي', 'g'),
      '\s+', ' ', 'g')
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE TABLE admins (
  id              SERIAL PRIMARY KEY,
  username        VARCHAR(100) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
  id              SERIAL PRIMARY KEY,
  name_ar         VARCHAR(255) NOT NULL,
  name_en         VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) UNIQUE NOT NULL,
  parent_id       INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  icon            VARCHAR(255),
  description_ar  TEXT,
  description_en  TEXT,
  sort_order      INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE brands (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  name_ar         VARCHAR(255),
  slug            VARCHAR(255) UNIQUE NOT NULL,
  logo_url        VARCHAR(500),
  description_ar  TEXT,
  description_en  TEXT,
  is_active       BOOLEAN DEFAULT true,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE specification_templates (
  id              SERIAL PRIMARY KEY,
  category_id     INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  field_key       VARCHAR(100) NOT NULL,
  label_ar        VARCHAR(255) NOT NULL,
  label_en        VARCHAR(255) NOT NULL,
  field_type      VARCHAR(50) NOT NULL,
  unit            VARCHAR(50),
  options         JSONB,
  is_required     BOOLEAN DEFAULT false,
  is_filterable   BOOLEAN DEFAULT false,
  sort_order      INTEGER DEFAULT 0
);

CREATE TABLE products (
  id                SERIAL PRIMARY KEY,
  name_ar           VARCHAR(500) NOT NULL,
  name_en           VARCHAR(500) NOT NULL,
  slug              VARCHAR(500) UNIQUE NOT NULL,
  description_ar    TEXT,
  description_en    TEXT,
  category_id       INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  brand_id          INTEGER REFERENCES brands(id) ON DELETE SET NULL,
  price_syp         DECIMAL(14,2),
  price_usd         DECIMAL(10,4),
  has_variants      BOOLEAN DEFAULT false,
  has_details       BOOLEAN DEFAULT true,
  is_available      BOOLEAN DEFAULT true,
  is_featured       BOOLEAN DEFAULT false,
  view_count        INTEGER DEFAULT 0,
  tags              TEXT[],
  meta_keywords     TEXT,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE product_variants (
  id              SERIAL PRIMARY KEY,
  product_id      INTEGER REFERENCES products(id) ON DELETE CASCADE,
  variant_label_ar VARCHAR(255) NOT NULL,
  variant_label_en VARCHAR(255) NOT NULL,
  price_syp       DECIMAL(14,2),
  price_usd       DECIMAL(10,4),
  is_available    BOOLEAN DEFAULT true,
  sort_order      INTEGER DEFAULT 0
);

CREATE TABLE product_specifications (
  id              SERIAL PRIMARY KEY,
  product_id      INTEGER REFERENCES products(id) ON DELETE CASCADE,
  field_key       VARCHAR(100) NOT NULL,
  value_ar        TEXT,
  value_en        TEXT,
  value_numeric   DECIMAL(14,4),
  unit            VARCHAR(50)
);

CREATE TABLE product_images (
  id              SERIAL PRIMARY KEY,
  product_id      INTEGER REFERENCES products(id) ON DELETE CASCADE,
  image_url       VARCHAR(500) NOT NULL,
  thumbnail_url   VARCHAR(500),
  alt_text_ar     VARCHAR(255),
  alt_text_en     VARCHAR(255),
  is_primary      BOOLEAN DEFAULT false,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE exchange_rate (
  id              SERIAL PRIMARY KEY,
  usd_to_syp      DECIMAL(10,2) NOT NULL,
  note            TEXT,
  updated_at      TIMESTAMP DEFAULT NOW(),
  updated_by      VARCHAR(100)
);

CREATE TABLE advertisements (
  id              SERIAL PRIMARY KEY,
  title_ar        VARCHAR(500),
  title_en        VARCHAR(500),
  description_ar  TEXT,
  description_en  TEXT,
  image_url       VARCHAR(500) NOT NULL,
  link_url        VARCHAR(500),
  position        VARCHAR(100) NOT NULL,
  is_active       BOOLEAN DEFAULT true,
  start_date      TIMESTAMP,
  end_date        TIMESTAMP,
  sort_order      INTEGER DEFAULT 0,
  click_count     INTEGER DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE site_settings (
  key             VARCHAR(100) PRIMARY KEY,
  value           TEXT,
  type            VARCHAR(50) DEFAULT 'text',
  description     TEXT,
  updated_at      TIMESTAMP DEFAULT NOW()
);

INSERT INTO site_settings (key, value, type, description) VALUES
  ('site_name_ar',     'Syria Cable Zone',  'text',    'Site name in Arabic'),
  ('site_name_en',     'Syria Cable Zone',  'text',    'Site name in English'),
  ('whatsapp_number',  '',                  'text',    'WhatsApp contact number'),
  ('phone_number',     '',                  'text',    'Main phone number'),
  ('address_ar',       '',                  'text',    'Address in Arabic'),
  ('address_en',       '',                  'text',    'Address in English'),
  ('logo_url',         '',                  'text',    'Site logo URL'),
  ('facebook_url',     '',                  'text',    'Facebook page URL'),
  ('instagram_url',    '',                  'text',    'Instagram page URL'),
  ('telegram_url',     '',                  'text',    'Telegram URL'),
  ('products_per_page','24',               'number',  'Products shown per page'),
  ('similar_products_count', '8',          'number',  'Number of similar products to show');

-- Indexes
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_name_ar ON products USING gin(to_tsvector('simple', name_ar));
CREATE INDEX idx_products_name_en ON products USING gin(to_tsvector('simple', name_en));
CREATE INDEX idx_images_product ON product_images(product_id);
CREATE INDEX idx_images_primary ON product_images(product_id, is_primary);
CREATE INDEX idx_specs_product ON product_specifications(product_id);
CREATE INDEX idx_specs_field ON product_specifications(field_key);
CREATE INDEX idx_ads_position ON advertisements(position, is_active);
CREATE INDEX idx_variants_product ON product_variants(product_id);
