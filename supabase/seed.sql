-- Seed products from ELLA inventory spreadsheet
-- Run AFTER 001_initial_schema.sql

insert into public.products (slug, name_en, name_es, description_en, description_es, brand, base_price, target_buy_price, expected_profit, is_featured, is_active)
values
  ('iphone-15', 'iPhone 15', 'iPhone 15', 'Best mainstream balance — unlocked, tested, and ready.', 'El mejor equilibrio — desbloqueado y probado.', 'Apple', 406.99, 277.74, 74.62, true, true),
  ('iphone-14', 'iPhone 14', 'iPhone 14', 'Broad buyer demand — excellent value.', 'Alta demanda — excelente valor.', 'Apple', 296.99, 182.65, 69.61, true, true),
  ('iphone-13', 'iPhone 13', 'iPhone 13', 'Accessible fast-moving option.', 'Opción accesible y popular.', 'Apple', 273.99, 162.76, 68.57, false, true),
  ('iphone-15-pro', 'iPhone 15 Pro', 'iPhone 15 Pro', 'Premium without Pro Max capital.', 'Premium sin precio Pro Max.', 'Apple', 503.99, 333.10, 107.53, true, true),
  ('iphone-14-pro-max', 'iPhone 14 Pro Max', 'iPhone 14 Pro Max', 'Popular large premium model.', 'Modelo premium grande popular.', 'Apple', 451.99, 316.65, 76.67, false, true),
  ('galaxy-s24-ultra', 'Galaxy S24 Ultra', 'Galaxy S24 Ultra', 'Best Android premium candidate.', 'El mejor Android premium.', 'Samsung', 527.99, 353.85, 108.62, true, true),
  ('iphone-15-pro-max', 'iPhone 15 Pro Max', 'iPhone 15 Pro Max', 'Highest dollar profit potential.', 'Máximo potencial de ganancia.', 'Apple', 596.99, 413.50, 111.76, true, true)
on conflict (slug) do nothing;

-- Example: promote first admin user (replace email after signup)
-- update public.profiles set role = 'admin' where id = (
--   select id from auth.users where email = 'ellaphonerepair@gmail.com'
-- );
