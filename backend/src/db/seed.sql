-- Seed data for Syria Cable Zone

-- Admin user (password: admin123)
INSERT INTO admins (username, password_hash) VALUES
  ('admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LnXDetFvJkW');

-- Exchange rate
INSERT INTO exchange_rate (usd_to_syp, note, updated_by) VALUES
  (13000, 'Initial rate', 'admin');

-- Root category
INSERT INTO categories (id, name_ar, name_en, slug, parent_id, sort_order) VALUES
  (1, 'الإلكترونيات', 'Electronics', 'electronics', NULL, 1);

-- Level 2 categories
INSERT INTO categories (id, name_ar, name_en, slug, parent_id, sort_order) VALUES
  (2, 'الكابلات والأسلاك', 'Cables & Wires', 'cables-wires', 1, 1),
  (3, 'المكونات الإلكترونية', 'Electronic Components', 'electronic-components', 1, 2),
  (4, 'الأدوات والمعدات', 'Tools & Equipment', 'tools-equipment', 1, 3),
  (5, 'الهواتف والأجهزة', 'Phones & Devices', 'phones-devices', 1, 4);

-- Level 3 categories under cables-wires
INSERT INTO categories (id, name_ar, name_en, slug, parent_id, sort_order) VALUES
  (6, 'كابلات الطاقة', 'Power Cables', 'power-cables', 2, 1),
  (7, 'كابلات الشبكة', 'Network Cables', 'network-cables', 2, 2),
  (8, 'كابلات البيانات', 'Data Cables', 'data-cables', 2, 3);

-- Level 3 categories under electronic-components
INSERT INTO categories (id, name_ar, name_en, slug, parent_id, sort_order) VALUES
  (9,  'المقاومات', 'Resistors', 'resistors', 3, 1),
  (10, 'المكثفات', 'Capacitors', 'capacitors', 3, 2),
  (11, 'الترانزستورات', 'Transistors', 'transistors', 3, 3),
  (12, 'الدوائر المتكاملة', 'Integrated Circuits', 'integrated-circuits', 3, 4);

-- Reset sequence
SELECT setval('categories_id_seq', 12);

-- Specification templates for Power Cables
INSERT INTO specification_templates (category_id, field_key, label_ar, label_en, field_type, unit, is_required, is_filterable, sort_order) VALUES
  (6, 'cable_cross_section', 'مقطع الكابل', 'Cross Section', 'number', 'mm²', true, true, 1),
  (6, 'cable_voltage', 'الجهد الكهربائي', 'Voltage Rating', 'number', 'V', true, true, 2),
  (6, 'cable_length', 'الطول', 'Length', 'number', 'm', false, true, 3),
  (6, 'cable_material', 'مادة الموصل', 'Conductor Material', 'select', NULL, false, true, 4);

-- Specification templates for Network Cables
INSERT INTO specification_templates (category_id, field_key, label_ar, label_en, field_type, unit, is_required, is_filterable, sort_order) VALUES
  (7, 'cable_category', 'فئة الكابل', 'Cable Category', 'select', NULL, true, true, 1),
  (7, 'cable_speed', 'سرعة النقل', 'Transfer Speed', 'number', 'Gbps', false, true, 2),
  (7, 'cable_length', 'الطول', 'Length', 'number', 'm', false, true, 3),
  (7, 'cable_shielding', 'الحماية', 'Shielding', 'select', NULL, false, true, 4);

-- Specification templates for Data Cables
INSERT INTO specification_templates (category_id, field_key, label_ar, label_en, field_type, unit, is_required, is_filterable, sort_order) VALUES
  (8, 'connector_type', 'نوع الموصل', 'Connector Type', 'select', NULL, true, true, 1),
  (8, 'cable_length', 'الطول', 'Length', 'number', 'cm', false, true, 2),
  (8, 'data_speed', 'سرعة النقل', 'Data Speed', 'number', 'Gbps', false, true, 3),
  (8, 'charging_power', 'قدرة الشحن', 'Charging Power', 'number', 'W', false, false, 4);

-- Specification templates for Resistors
INSERT INTO specification_templates (category_id, field_key, label_ar, label_en, field_type, unit, is_required, is_filterable, sort_order) VALUES
  (9, 'resistance_value', 'قيمة المقاومة', 'Resistance Value', 'number', 'Ω', true, true, 1),
  (9, 'power_rating', 'التقييم الطاقي', 'Power Rating', 'number', 'W', true, true, 2),
  (9, 'tolerance', 'التسامح', 'Tolerance', 'select', NULL, false, true, 3),
  (9, 'package_type', 'نوع العبوة', 'Package Type', 'select', NULL, false, true, 4);

-- Specification templates for Capacitors
INSERT INTO specification_templates (category_id, field_key, label_ar, label_en, field_type, unit, is_required, is_filterable, sort_order) VALUES
  (10, 'capacitance', 'السعة', 'Capacitance', 'number', 'µF', true, true, 1),
  (10, 'voltage_rating', 'الجهد الاسمي', 'Voltage Rating', 'number', 'V', true, true, 2),
  (10, 'capacitor_type', 'نوع المكثف', 'Capacitor Type', 'select', NULL, false, true, 3),
  (10, 'package_type', 'نوع العبوة', 'Package Type', 'select', NULL, false, true, 4);

-- Specification templates for Transistors
INSERT INTO specification_templates (category_id, field_key, label_ar, label_en, field_type, unit, is_required, is_filterable, sort_order) VALUES
  (11, 'transistor_type', 'نوع الترانزستور', 'Transistor Type', 'select', NULL, true, true, 1),
  (11, 'max_voltage', 'الجهد الأقصى', 'Max Voltage', 'number', 'V', true, true, 2),
  (11, 'max_current', 'التيار الأقصى', 'Max Current', 'number', 'A', true, true, 3),
  (11, 'package_type', 'نوع العبوة', 'Package Type', 'select', NULL, false, true, 4);

-- Specification templates for Integrated Circuits
INSERT INTO specification_templates (category_id, field_key, label_ar, label_en, field_type, unit, is_required, is_filterable, sort_order) VALUES
  (12, 'ic_function', 'وظيفة الدائرة', 'IC Function', 'text', NULL, true, false, 1),
  (12, 'supply_voltage', 'جهد التشغيل', 'Supply Voltage', 'number', 'V', true, true, 2),
  (12, 'package_type', 'نوع العبوة', 'Package Type', 'select', NULL, false, true, 3),
  (12, 'pin_count', 'عدد الأطراف', 'Pin Count', 'number', NULL, false, true, 4);
