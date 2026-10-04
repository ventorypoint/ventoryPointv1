ALTER TABLE client_accounts 
  RENAME COLUMN brand_name TO name;

ALTER TABLE client_accounts 
  RENAME COLUMN primary_contact TO primary_contact_email;

ALTER TABLE client_accounts 
  ADD COLUMN primary_contact_name text,
  ADD COLUMN primary_contact_phone text;
