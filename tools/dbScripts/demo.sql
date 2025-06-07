-- Demo Church
INSERT INTO churches (id, name, subDomain, address1, city, state, zip, country, latitude, longitude) VALUES 
('CHU00000001', 'Grace Community Church', 'grace', '123 Main Street', 'Springfield', 'IL', '62701', 'US', 39.7817, -89.6501);

-- Demo Households (25 households)
INSERT INTO households (id, churchId, name) VALUES 
('HOU00000001', 'CHU00000001', 'Smith Family'),
('HOU00000002', 'CHU00000001', 'Johnson Family'),
('HOU00000003', 'CHU00000001', 'Williams Family'),
('HOU00000004', 'CHU00000001', 'Brown Family'),
('HOU00000005', 'CHU00000001', 'Jones Family'),
('HOU00000006', 'CHU00000001', 'Garcia Family'),
('HOU00000007', 'CHU00000001', 'Miller Family'),
('HOU00000008', 'CHU00000001', 'Davis Family'),
('HOU00000009', 'CHU00000001', 'Rodriguez Family'),
('HOU00000010', 'CHU00000001', 'Martinez Family'),
('HOU00000011', 'CHU00000001', 'Hernandez Family'),
('HOU00000012', 'CHU00000001', 'Lopez Family'),
('HOU00000013', 'CHU00000001', 'Gonzalez Family'),
('HOU00000014', 'CHU00000001', 'Wilson Family'),
('HOU00000015', 'CHU00000001', 'Anderson Family'),
('HOU00000016', 'CHU00000001', 'Thomas Family'),
('HOU00000017', 'CHU00000001', 'Taylor Family'),
('HOU00000018', 'CHU00000001', 'Moore Family'),
('HOU00000019', 'CHU00000001', 'Jackson Family'),
('HOU00000020', 'CHU00000001', 'Martin Family'),
('HOU00000021', 'CHU00000001', 'Lee Family'),
('HOU00000022', 'CHU00000001', 'Thompson Family'),
('HOU00000023', 'CHU00000001', 'White Family'),
('HOU00000024', 'CHU00000001', 'Harris Family'),
('HOU00000025', 'CHU00000001', 'Clark Family');

-- Demo People (Sample of first 3 households to show structure - will add more in next edit)
INSERT INTO people (id, churchId, displayName, firstName, lastName, gender, maritalStatus, birthDate, email, householdId, householdRole, membershipStatus) VALUES
-- Smith Family (Parents + 3 children)
('PER00000001', 'CHU00000001', 'John Smith', 'John', 'Smith', 'Male', 'Married', '1975-06-15', 'john.smith@email.com', 'HOU00000001', 'Head', 'Member'),
('PER00000002', 'CHU00000001', 'Mary Smith', 'Mary', 'Smith', 'Female', 'Married', '1978-03-22', 'mary.smith@email.com', 'HOU00000001', 'Spouse', 'Member'),
('PER00000003', 'CHU00000001', 'James Smith', 'James', 'Smith', 'Male', 'Single', '2005-11-08', 'james.smith@email.com', 'HOU00000001', 'Child', 'Member'),
('PER00000004', 'CHU00000001', 'Sarah Smith', 'Sarah', 'Smith', 'Female', 'Single', '2008-04-17', 'sarah.smith@email.com', 'HOU00000001', 'Child', 'Member'),
('PER00000005', 'CHU00000001', 'Michael Smith', 'Michael', 'Smith', 'Male', 'Single', '2012-09-30', NULL, 'HOU00000001', 'Child', 'Member'),

-- Johnson Family (Parents + 2 children + 1 grandparent)
('PER00000006', 'CHU00000001', 'Robert Johnson', 'Robert', 'Johnson', 'Male', 'Married', '1980-01-10', 'robert.johnson@email.com', 'HOU00000002', 'Head', 'Member'),
('PER00000007', 'CHU00000001', 'Patricia Johnson', 'Patricia', 'Johnson', 'Female', 'Married', '1982-07-25', 'patricia.johnson@email.com', 'HOU00000002', 'Spouse', 'Member'),
('PER00000008', 'CHU00000001', 'Elizabeth Johnson', 'Elizabeth', 'Johnson', 'Female', 'Single', '2010-12-03', NULL, 'HOU00000002', 'Child', 'Member'),
('PER00000009', 'CHU00000001', 'David Johnson', 'David', 'Johnson', 'Male', 'Single', '2014-05-19', NULL, 'HOU00000002', 'Child', 'Member'),
('PER00000010', 'CHU00000001', 'Margaret Johnson', 'Margaret', 'Johnson', 'Female', 'Widowed', '1955-08-14', 'margaret.johnson@email.com', 'HOU00000002', 'Other', 'Member'),

-- Williams Family (Single parent + 2 children)
('PER00000011', 'CHU00000001', 'Jennifer Williams', 'Jennifer', 'Williams', 'Female', 'Divorced', '1985-11-30', 'jennifer.williams@email.com', 'HOU00000003', 'Head', 'Member'),
('PER00000012', 'CHU00000001', 'Christopher Williams', 'Christopher', 'Williams', 'Male', 'Single', '2011-03-15', NULL, 'HOU00000003', 'Child', 'Member'),
('PER00000013', 'CHU00000001', 'Emma Williams', 'Emma', 'Williams', 'Female', 'Single', '2013-07-22', NULL, 'HOU00000003', 'Child', 'Member');

-- Brown Family (Young married couple)
('PER00000014', 'CHU00000001', 'Daniel Brown', 'Daniel', 'Brown', 'Male', 'Married', '1992-04-18', 'daniel.brown@email.com', 'HOU00000004', 'Head', 'Member'),
('PER00000015', 'CHU00000001', 'Lisa Brown', 'Lisa', 'Brown', 'Female', 'Married', '1993-09-25', 'lisa.brown@email.com', 'HOU00000004', 'Spouse', 'Member'),

-- Jones Family (Blended family)
('PER00000016', 'CHU00000001', 'Thomas Jones', 'Thomas', 'Jones', 'Male', 'Married', '1982-11-30', 'thomas.jones@email.com', 'HOU00000005', 'Head', 'Member'),
('PER00000017', 'CHU00000001', 'Rebecca Jones', 'Rebecca', 'Jones', 'Female', 'Married', '1984-05-12', 'rebecca.jones@email.com', 'HOU00000005', 'Spouse', 'Member'),
('PER00000018', 'CHU00000001', 'Matthew Jones', 'Matthew', 'Jones', 'Male', 'Single', '2007-08-15', NULL, 'HOU00000005', 'Child', 'Member'),
('PER00000019', 'CHU00000001', 'Sophia Jones', 'Sophia', 'Jones', 'Female', 'Single', '2010-02-28', NULL, 'HOU00000005', 'Child', 'Member'),
('PER00000020', 'CHU00000001', 'Ethan Smith', 'Ethan', 'Smith', 'Male', 'Single', '2009-11-03', NULL, 'HOU00000005', 'Child', 'Member'),

-- Garcia Family (Multi-generational)
('PER00000021', 'CHU00000001', 'Carlos Garcia', 'Carlos', 'Garcia', 'Male', 'Married', '1978-07-22', 'carlos.garcia@email.com', 'HOU00000006', 'Head', 'Member'),
('PER00000022', 'CHU00000001', 'Maria Garcia', 'Maria', 'Garcia', 'Female', 'Married', '1980-03-14', 'maria.garcia@email.com', 'HOU00000006', 'Spouse', 'Member'),
('PER00000023', 'CHU00000001', 'Isabella Garcia', 'Isabella', 'Garcia', 'Female', 'Single', '2012-06-30', NULL, 'HOU00000006', 'Child', 'Member'),
('PER00000024', 'CHU00000001', 'Antonio Garcia', 'Antonio', 'Garcia', 'Male', 'Widowed', '1952-12-05', 'antonio.garcia@email.com', 'HOU00000006', 'Other', 'Member'),

-- Miller Family (Empty nesters)
('PER00000025', 'CHU00000001', 'Richard Miller', 'Richard', 'Miller', 'Male', 'Married', '1965-09-18', 'richard.miller@email.com', 'HOU00000007', 'Head', 'Member'),
('PER00000026', 'CHU00000001', 'Susan Miller', 'Susan', 'Miller', 'Female', 'Married', '1967-02-25', 'susan.miller@email.com', 'HOU00000007', 'Spouse', 'Member'),

-- Davis Family (Young family)
('PER00000027', 'CHU00000001', 'Michael Davis', 'Michael', 'Davis', 'Male', 'Married', '1988-05-20', 'michael.davis@email.com', 'HOU00000008', 'Head', 'Member'),
('PER00000028', 'CHU00000001', 'Emily Davis', 'Emily', 'Davis', 'Female', 'Married', '1989-11-15', 'emily.davis@email.com', 'HOU00000008', 'Spouse', 'Member'),
('PER00000029', 'CHU00000001', 'Olivia Davis', 'Olivia', 'Davis', 'Female', 'Single', '2018-03-10', NULL, 'HOU00000008', 'Child', 'Member'),
('PER00000030', 'CHU00000001', 'Noah Davis', 'Noah', 'Davis', 'Male', 'Single', '2020-07-22', NULL, 'HOU00000008', 'Child', 'Member'),

-- Rodriguez Family (Single parent)
('PER00000031', 'CHU00000001', 'Sofia Rodriguez', 'Sofia', 'Rodriguez', 'Female', 'Divorced', '1986-08-12', 'sofia.rodriguez@email.com', 'HOU00000009', 'Head', 'Member'),
('PER00000032', 'CHU00000001', 'Lucas Rodriguez', 'Lucas', 'Rodriguez', 'Male', 'Single', '2013-04-25', NULL, 'HOU00000009', 'Child', 'Member'),
('PER00000033', 'CHU00000001', 'Mia Rodriguez', 'Mia', 'Rodriguez', 'Female', 'Single', '2015-09-18', NULL, 'HOU00000009', 'Child', 'Member'),

-- Martinez Family (Senior couple)
('PER00000034', 'CHU00000001', 'Jose Martinez', 'Jose', 'Martinez', 'Male', 'Married', '1958-03-15', 'jose.martinez@email.com', 'HOU00000010', 'Head', 'Member'),
('PER00000035', 'CHU00000001', 'Carmen Martinez', 'Carmen', 'Martinez', 'Female', 'Married', '1960-07-28', 'carmen.martinez@email.com', 'HOU00000010', 'Spouse', 'Member'),

-- Hernandez Family (Large family)
('PER00000036', 'CHU00000001', 'Miguel Hernandez', 'Miguel', 'Hernandez', 'Male', 'Married', '1983-01-20', 'miguel.hernandez@email.com', 'HOU00000011', 'Head', 'Member'),
('PER00000037', 'CHU00000001', 'Ana Hernandez', 'Ana', 'Hernandez', 'Female', 'Married', '1984-06-15', 'ana.hernandez@email.com', 'HOU00000011', 'Spouse', 'Member'),
('PER00000038', 'CHU00000001', 'Diego Hernandez', 'Diego', 'Hernandez', 'Male', 'Single', '2009-11-30', NULL, 'HOU00000011', 'Child', 'Member'),
('PER00000039', 'CHU00000001', 'Valentina Hernandez', 'Valentina', 'Hernandez', 'Female', 'Single', '2011-04-12', NULL, 'HOU00000011', 'Child', 'Member'),
('PER00000040', 'CHU00000001', 'Gabriel Hernandez', 'Gabriel', 'Hernandez', 'Male', 'Single', '2014-08-25', NULL, 'HOU00000011', 'Child', 'Member'),
('PER00000041', 'CHU00000001', 'Isabella Hernandez', 'Isabella', 'Hernandez', 'Female', 'Single', '2016-12-03', NULL, 'HOU00000011', 'Child', 'Member'),

-- Lopez Family (Young professionals)
('PER00000042', 'CHU00000001', 'David Lopez', 'David', 'Lopez', 'Male', 'Married', '1990-09-10', 'david.lopez@email.com', 'HOU00000012', 'Head', 'Member'),
('PER00000043', 'CHU00000001', 'Laura Lopez', 'Laura', 'Lopez', 'Female', 'Married', '1991-12-05', 'laura.lopez@email.com', 'HOU00000012', 'Spouse', 'Member'),

-- Gonzalez Family (Multi-generational)
('PER00000044', 'CHU00000001', 'Roberto Gonzalez', 'Roberto', 'Gonzalez', 'Male', 'Married', '1975-04-18', 'roberto.gonzalez@email.com', 'HOU00000013', 'Head', 'Member'),
('PER00000045', 'CHU00000001', 'Elena Gonzalez', 'Elena', 'Gonzalez', 'Female', 'Married', '1977-08-22', 'elena.gonzalez@email.com', 'HOU00000013', 'Spouse', 'Member'),
('PER00000046', 'CHU00000001', 'Adriana Gonzalez', 'Adriana', 'Gonzalez', 'Female', 'Single', '2010-03-15', NULL, 'HOU00000013', 'Child', 'Member'),
('PER00000047', 'CHU00000001', 'Fernando Gonzalez', 'Fernando', 'Gonzalez', 'Male', 'Single', '2012-07-28', NULL, 'HOU00000013', 'Child', 'Member'),
('PER00000048', 'CHU00000001', 'Rosa Gonzalez', 'Rosa', 'Gonzalez', 'Female', 'Widowed', '1950-11-30', 'rosa.gonzalez@email.com', 'HOU00000013', 'Other', 'Member'),

-- Wilson Family (Blended family)
('PER00000049', 'CHU00000001', 'James Wilson', 'James', 'Wilson', 'Male', 'Married', '1981-06-25', 'james.wilson@email.com', 'HOU00000014', 'Head', 'Member'),
('PER00000050', 'CHU00000001', 'Sarah Wilson', 'Sarah', 'Wilson', 'Female', 'Married', '1983-02-14', 'sarah.wilson@email.com', 'HOU00000014', 'Spouse', 'Member'),
('PER00000051', 'CHU00000001', 'Andrew Wilson', 'Andrew', 'Wilson', 'Male', 'Single', '2008-09-20', NULL, 'HOU00000014', 'Child', 'Member'),
('PER00000052', 'CHU00000001', 'Emma Thompson', 'Emma', 'Thompson', 'Female', 'Single', '2011-05-12', NULL, 'HOU00000014', 'Child', 'Member'),
('PER00000053', 'CHU00000001', 'Benjamin Wilson', 'Benjamin', 'Wilson', 'Male', 'Single', '2014-11-30', NULL, 'HOU00000014', 'Child', 'Member'),

-- Anderson Family (Senior with adult child)
('PER00000054', 'CHU00000001', 'William Anderson', 'William', 'Anderson', 'Male', 'Widowed', '1948-03-10', 'william.anderson@email.com', 'HOU00000015', 'Head', 'Member'),
('PER00000055', 'CHU00000001', 'Elizabeth Anderson', 'Elizabeth', 'Anderson', 'Female', 'Single', '1975-08-15', 'elizabeth.anderson@email.com', 'HOU00000015', 'Child', 'Member'),

-- Thomas Family (Young family)
('PER00000056', 'CHU00000001', 'Christopher Thomas', 'Christopher', 'Thomas', 'Male', 'Married', '1987-12-05', 'christopher.thomas@email.com', 'HOU00000016', 'Head', 'Member'),
('PER00000057', 'CHU00000001', 'Amanda Thomas', 'Amanda', 'Thomas', 'Female', 'Married', '1989-04-18', 'amanda.thomas@email.com', 'HOU00000016', 'Spouse', 'Member'),
('PER00000058', 'CHU00000001', 'Daniel Thomas', 'Daniel', 'Thomas', 'Male', 'Single', '2017-06-22', NULL, 'HOU00000016', 'Child', 'Member'),
('PER00000059', 'CHU00000001', 'Sophia Thomas', 'Sophia', 'Thomas', 'Female', 'Single', '2019-09-15', NULL, 'HOU00000016', 'Child', 'Member'),

-- Taylor Family (Single adult)
('PER00000060', 'CHU00000001', 'Jessica Taylor', 'Jessica', 'Taylor', 'Female', 'Single', '1992-07-30', 'jessica.taylor@email.com', 'HOU00000017', 'Head', 'Member'),

-- Moore Family (Empty nesters)
('PER00000061', 'CHU00000001', 'Robert Moore', 'Robert', 'Moore', 'Male', 'Married', '1962-05-12', 'robert.moore@email.com', 'HOU00000018', 'Head', 'Member'),
('PER00000062', 'CHU00000001', 'Patricia Moore', 'Patricia', 'Moore', 'Female', 'Married', '1964-09-25', 'patricia.moore@email.com', 'HOU00000018', 'Spouse', 'Member'),

-- Jackson Family (Multi-generational)
('PER00000063', 'CHU00000001', 'Marcus Jackson', 'Marcus', 'Jackson', 'Male', 'Married', '1979-11-15', 'marcus.jackson@email.com', 'HOU00000019', 'Head', 'Member'),
('PER00000064', 'CHU00000001', 'Nicole Jackson', 'Nicole', 'Jackson', 'Female', 'Married', '1981-03-28', 'nicole.jackson@email.com', 'HOU00000019', 'Spouse', 'Member'),
('PER00000065', 'CHU00000001', 'Jordan Jackson', 'Jordan', 'Jackson', 'Male', 'Single', '2013-08-10', NULL, 'HOU00000019', 'Child', 'Member'),
('PER00000066', 'CHU00000001', 'Grace Jackson', 'Grace', 'Jackson', 'Female', 'Single', '2015-12-22', NULL, 'HOU00000019', 'Child', 'Member'),
('PER00000067', 'CHU00000001', 'Dorothy Jackson', 'Dorothy', 'Jackson', 'Female', 'Widowed', '1953-06-18', 'dorothy.jackson@email.com', 'HOU00000019', 'Other', 'Member'),

-- Martin Family (Young couple)
('PER00000068', 'CHU00000001', 'Kevin Martin', 'Kevin', 'Martin', 'Male', 'Married', '1991-02-20', 'kevin.martin@email.com', 'HOU00000020', 'Head', 'Member'),
('PER00000069', 'CHU00000001', 'Rachel Martin', 'Rachel', 'Martin', 'Female', 'Married', '1992-08-15', 'rachel.martin@email.com', 'HOU00000020', 'Spouse', 'Member'),

-- Lee Family (Single parent)
('PER00000070', 'CHU00000001', 'Michelle Lee', 'Michelle', 'Lee', 'Female', 'Divorced', '1984-10-05', 'michelle.lee@email.com', 'HOU00000021', 'Head', 'Member'),
('PER00000071', 'CHU00000001', 'Ryan Lee', 'Ryan', 'Lee', 'Male', 'Single', '2012-01-18', NULL, 'HOU00000021', 'Child', 'Member'),
('PER00000072', 'CHU00000001', 'Ava Lee', 'Ava', 'Lee', 'Female', 'Single', '2014-04-30', NULL, 'HOU00000021', 'Child', 'Member'),

-- Thompson Family (Senior couple)
('PER00000073', 'CHU00000001', 'George Thompson', 'George', 'Thompson', 'Male', 'Married', '1956-07-22', 'george.thompson@email.com', 'HOU00000022', 'Head', 'Member'),
('PER00000074', 'CHU00000001', 'Margaret Thompson', 'Margaret', 'Thompson', 'Female', 'Married', '1958-12-15', 'margaret.thompson@email.com', 'HOU00000022', 'Spouse', 'Member'),

-- White Family (Young family)
('PER00000075', 'CHU00000001', 'Steven White', 'Steven', 'White', 'Male', 'Married', '1986-03-10', 'steven.white@email.com', 'HOU00000023', 'Head', 'Member'),
('PER00000076', 'CHU00000001', 'Melissa White', 'Melissa', 'White', 'Female', 'Married', '1987-09-25', 'melissa.white@email.com', 'HOU00000023', 'Spouse', 'Member'),
('PER00000077', 'CHU00000001', 'Jacob White', 'Jacob', 'White', 'Male', 'Single', '2016-05-18', NULL, 'HOU00000023', 'Child', 'Member'),
('PER00000078', 'CHU00000001', 'Madison White', 'Madison', 'White', 'Female', 'Single', '2018-11-30', NULL, 'HOU00000023', 'Child', 'Member'),

-- Harris Family (Single adult)
('PER00000079', 'CHU00000001', 'Brian Harris', 'Brian', 'Harris', 'Male', 'Single', '1993-04-15', 'brian.harris@email.com', 'HOU00000024', 'Head', 'Member'),

-- Clark Family (Empty nesters)
('PER00000080', 'CHU00000001', 'Donald Clark', 'Donald', 'Clark', 'Male', 'Married', '1960-08-28', 'donald.clark@email.com', 'HOU00000025', 'Head', 'Member'),
('PER00000081', 'CHU00000001', 'Carol Clark', 'Carol', 'Clark', 'Female', 'Married', '1962-01-12', 'carol.clark@email.com', 'HOU00000025', 'Spouse', 'Member');

-- Notes for various people
INSERT INTO notes (id, churchId, contentType, contentId, noteType, addedBy, createdAt, contents, updatedAt) VALUES
-- Pastoral Notes
('NOT00000001', 'CHU00000001', 'person', 'PER00000001', 'Pastoral', 'PER00000001', '2024-01-15 14:30:00', 'Met with John to discuss his interest in leading the men''s Bible study group. Very enthusiastic and well-prepared.', '2024-01-15 14:30:00'),
('NOT00000002', 'CHU00000001', 'person', 'PER00000031', 'Pastoral', 'PER00000001', '2024-02-01 10:15:00', 'Follow-up meeting with Sofia regarding her divorce support group participation. She''s making good progress and has been a great support to others.', '2024-02-01 10:15:00'),
('NOT00000003', 'CHU00000001', 'person', 'PER00000054', 'Pastoral', 'PER00000001', '2024-02-10 15:45:00', 'Home visit with William. Discussed his recent health concerns and arranged for meal delivery service.', '2024-02-10 15:45:00'),

-- Prayer Requests
('NOT00000004', 'CHU00000001', 'person', 'PER00000036', 'Prayer', 'PER00000036', '2024-02-15 09:00:00', 'Prayer request for Miguel''s job interview next week. Hoping for a position that would allow more time with family.', '2024-02-15 09:00:00'),
('NOT00000005', 'CHU00000001', 'person', 'PER00000070', 'Prayer', 'PER00000070', '2024-02-16 11:20:00', 'Michelle requested prayer for her children''s transition to new school district.', '2024-02-16 11:20:00'),
('NOT00000006', 'CHU00000001', 'person', 'PER00000021', 'Prayer', 'PER00000021', '2024-02-17 14:00:00', 'Carlos asked for prayer for his father Antonio''s upcoming surgery.', '2024-02-17 14:00:00'),

-- General Notes
('NOT00000007', 'CHU00000001', 'person', 'PER00000049', 'General', 'PER00000001', '2024-02-18 16:30:00', 'James expressed interest in volunteering for the youth ministry. Has experience working with teens.', '2024-02-18 16:30:00'),
('NOT00000008', 'CHU00000001', 'person', 'PER00000063', 'General', 'PER00000001', '2024-02-19 13:15:00', 'Marcus mentioned he''s available to help with the church''s tech setup. Has IT background.', '2024-02-19 13:15:00'),

-- Family Notes
('NOT00000009', 'CHU00000001', 'person', 'PER00000016', 'Family', 'PER00000001', '2024-02-20 10:00:00', 'Thomas and Rebecca''s family adjusting well to blended family situation. Kids getting along better.', '2024-02-20 10:00:00'),
('NOT00000010', 'CHU00000001', 'person', 'PER00000044', 'Family', 'PER00000001', '2024-02-21 11:45:00', 'Roberto''s mother Rosa moved in with family. All adjusting well to multi-generational living.', '2024-02-21 11:45:00'),

-- Ministry Notes
('NOT00000011', 'CHU00000001', 'person', 'PER00000027', 'Ministry', 'PER00000001', '2024-02-22 09:30:00', 'Michael interested in starting a young families small group. Good leadership potential.', '2024-02-22 09:30:00'),
('NOT00000012', 'CHU00000001', 'person', 'PER00000042', 'Ministry', 'PER00000001', '2024-02-23 14:20:00', 'David and Laura offered to help with the church''s social media presence.', '2024-02-23 14:20:00'),

-- Health Notes
('NOT00000013', 'CHU00000001', 'person', 'PER00000073', 'Health', 'PER00000001', '2024-02-24 15:00:00', 'George recovering well from knee surgery. Church meals team providing support.', '2024-02-24 15:00:00'),
('NOT00000014', 'CHU00000001', 'person', 'PER00000034', 'Health', 'PER00000001', '2024-02-25 10:30:00', 'Jose and Carmen both received flu shots. Reminder to check in during flu season.', '2024-02-25 10:30:00'),

-- Financial Notes
('NOT00000015', 'CHU00000001', 'person', 'PER00000068', 'Financial', 'PER00000001', '2024-02-26 11:00:00', 'Kevin and Rachel started tithing regularly. Very faithful in their giving.', '2024-02-26 11:00:00'),
('NOT00000016', 'CHU00000001', 'person', 'PER00000056', 'Financial', 'PER00000001', '2024-02-27 13:45:00', 'Christopher and Amanda received financial counseling. Working on budget plan.', '2024-02-27 13:45:00'),

-- Discipleship Notes
('NOT00000017', 'CHU00000001', 'person', 'PER00000079', 'Discipleship', 'PER00000001', '2024-02-28 09:15:00', 'Brian completed new members class. Interested in baptism.', '2024-02-28 09:15:00'),
('NOT00000018', 'CHU00000001', 'person', 'PER00000060', 'Discipleship', 'PER00000001', '2024-02-29 14:30:00', 'Jessica started leading a small group Bible study for young professionals.', '2024-02-29 14:30:00'),

-- Outreach Notes
('NOT00000019', 'CHU00000001', 'person', 'PER00000075', 'Outreach', 'PER00000001', '2024-03-01 10:45:00', 'Steven and Melissa volunteered for community food drive. Great community connections.', '2024-03-01 10:45:00'),
('NOT00000020', 'CHU00000001', 'person', 'PER00000061', 'Outreach', 'PER00000001', '2024-03-02 11:30:00', 'Robert and Patricia hosting neighborhood Bible study in their home.', '2024-03-02 11:30:00');

-- Church Groups
INSERT INTO groups (id, churchId, categoryName, name, trackAttendance, parentPickup, printNametag, about, meetingTime, meetingLocation, tags, labels, slug) VALUES
-- Worship Services
('GRP00000001', 'CHU00000001', 'Worship', 'Sunday Morning Service', 1, 0, 1, 'Our main Sunday worship service featuring contemporary worship and biblical teaching.', 'Sunday 10:00 AM', 'Main Sanctuary', 'worship,service', 'worship,service,main', 'sunday-morning'),
('GRP00000002', 'CHU00000001', 'Worship', 'Sunday Evening Service', 1, 0, 1, 'A more intimate evening service with traditional hymns and deeper Bible study.', 'Sunday 6:00 PM', 'Main Sanctuary', 'worship,service', 'worship,service,evening', 'sunday-evening'),
('GRP00000003', 'CHU00000001', 'Worship', 'Wednesday Prayer Service', 1, 0, 1, 'Midweek prayer and worship service focusing on intercessory prayer.', 'Wednesday 7:00 PM', 'Main Sanctuary', 'worship,prayer', 'worship,prayer,midweek', 'wednesday-prayer'),

-- Sunday School Classes
('GRP00000004', 'CHU00000001', 'Sunday School', 'Adult Bible Class', 1, 0, 1, 'In-depth Bible study for adults of all ages.', 'Sunday 9:00 AM', 'Room 101', 'sunday-school,adult', 'sunday-school,adult,bible-study', 'adult-bible-class'),
('GRP00000005', 'CHU00000001', 'Sunday School', 'Young Adults Class', 1, 0, 1, 'Bible study and fellowship for young adults (18-30).', 'Sunday 9:00 AM', 'Room 102', 'sunday-school,young-adult', 'sunday-school,young-adult,bible-study', 'young-adults-class'),
('GRP00000006', 'CHU00000001', 'Sunday School', 'Senior Adults Class', 1, 0, 1, 'Bible study and fellowship for senior adults.', 'Sunday 9:00 AM', 'Room 103', 'sunday-school,senior', 'sunday-school,senior,bible-study', 'senior-adults-class'),

-- Children's Ministry
('GRP00000007', 'CHU00000001', 'Children', 'Nursery (0-2)', 1, 1, 1, 'Loving care for our youngest members during services.', 'Sunday 9:00 AM', 'Nursery', 'children,nursery', 'children,nursery,infant', 'nursery'),
('GRP00000008', 'CHU00000001', 'Children', 'Preschool (3-5)', 1, 1, 1, 'Age-appropriate Bible stories and activities for preschoolers.', 'Sunday 9:00 AM', 'Room 201', 'children,preschool', 'children,preschool,bible', 'preschool'),
('GRP00000009', 'CHU00000001', 'Children', 'Elementary (K-2)', 1, 1, 1, 'Interactive Bible lessons and activities for early elementary.', 'Sunday 9:00 AM', 'Room 202', 'children,elementary', 'children,elementary,bible', 'elementary-k2'),
('GRP00000010', 'CHU00000001', 'Children', 'Elementary (3-5)', 1, 1, 1, 'Bible lessons and activities for upper elementary.', 'Sunday 9:00 AM', 'Room 203', 'children,elementary', 'children,elementary,bible', 'elementary-35'),

-- Youth Ministry
('GRP00000011', 'CHU00000001', 'Youth', 'Middle School Youth', 1, 0, 1, 'Bible study and activities for middle school students.', 'Sunday 9:00 AM', 'Youth Room', 'youth,middle-school', 'youth,middle-school,bible-study', 'middle-school-youth'),
('GRP00000012', 'CHU00000001', 'Youth', 'High School Youth', 1, 0, 1, 'Bible study and activities for high school students.', 'Sunday 9:00 AM', 'Youth Room', 'youth,high-school', 'youth,high-school,bible-study', 'high-school-youth'),
('GRP00000013', 'CHU00000001', 'Youth', 'Youth Group', 1, 0, 1, 'Weekly youth group meeting with games, worship, and Bible study.', 'Wednesday 6:30 PM', 'Youth Room', 'youth,group', 'youth,group,weekly', 'youth-group'),

-- Small Groups
('GRP00000014', 'CHU00000001', 'Small Groups', 'Young Families Group', 1, 0, 1, 'Small group for families with young children.', 'Tuesday 7:00 PM', 'Various Homes', 'small-group,family', 'small-group,family,young', 'young-families-group'),
('GRP00000015', 'CHU00000001', 'Small Groups', 'Empty Nesters Group', 1, 0, 1, 'Small group for couples whose children have left home.', 'Thursday 7:00 PM', 'Various Homes', 'small-group,empty-nester', 'small-group,empty-nester', 'empty-nesters-group'),
('GRP00000016', 'CHU00000001', 'Small Groups', 'Men''s Bible Study', 1, 0, 1, 'Weekly Bible study and fellowship for men.', 'Saturday 7:00 AM', 'Fellowship Hall', 'small-group,men', 'small-group,men,bible-study', 'mens-bible-study'),
('GRP00000017', 'CHU00000001', 'Small Groups', 'Women''s Bible Study', 1, 0, 1, 'Weekly Bible study and fellowship for women.', 'Tuesday 10:00 AM', 'Fellowship Hall', 'small-group,women', 'small-group,women,bible-study', 'womens-bible-study'),

-- Music Ministry
('GRP00000018', 'CHU00000001', 'Music', 'Adult Choir', 1, 0, 1, 'Main worship choir for Sunday services.', 'Thursday 7:00 PM', 'Choir Room', 'music,choir', 'music,choir,adult', 'adult-choir'),
('GRP00000019', 'CHU00000001', 'Music', 'Praise Team', 1, 0, 1, 'Contemporary worship team for Sunday services.', 'Saturday 10:00 AM', 'Sanctuary', 'music,praise', 'music,praise,contemporary', 'praise-team'),
('GRP00000020', 'CHU00000001', 'Music', 'Children''s Choir', 1, 1, 1, 'Choir for children in grades 1-5.', 'Wednesday 4:00 PM', 'Choir Room', 'music,children', 'music,children,choir', 'childrens-choir'),

-- Outreach Ministry
('GRP00000021', 'CHU00000001', 'Outreach', 'Food Pantry Team', 1, 0, 1, 'Volunteers who staff our community food pantry.', 'Saturday 9:00 AM', 'Food Pantry', 'outreach,food-pantry', 'outreach,food-pantry,volunteer', 'food-pantry-team'),
('GRP00000022', 'CHU00000001', 'Outreach', 'Missions Committee', 1, 0, 1, 'Committee that oversees our local and global missions.', 'Monthly', 'Conference Room', 'outreach,missions', 'outreach,missions,committee', 'missions-committee'),
('GRP00000023', 'CHU00000001', 'Outreach', 'Community Service Team', 1, 0, 1, 'Volunteers who serve in various community projects.', 'Various', 'Various', 'outreach,community', 'outreach,community,volunteer', 'community-service-team'),

-- Special Ministries
('GRP00000024', 'CHU00000001', 'Special', 'Prayer Team', 1, 0, 1, 'Team that prays for church and community needs.', 'Various', 'Prayer Room', 'special,prayer', 'special,prayer,team', 'prayer-team'),
('GRP00000025', 'CHU00000001', 'Special', 'Greeters Ministry', 1, 0, 1, 'Team that welcomes visitors and members.', 'Sunday 9:30 AM', 'Main Entrance', 'special,greeters', 'special,greeters,welcome', 'greeters-ministry'),
('GRP00000026', 'CHU00000001', 'Special', 'Ushers Ministry', 1, 0, 1, 'Team that assists with Sunday services.', 'Sunday 9:30 AM', 'Sanctuary', 'special,ushers', 'special,ushers,service', 'ushers-ministry'),

-- Support Groups
('GRP00000027', 'CHU00000001', 'Support', 'Divorce Care', 1, 0, 1, 'Support group for those going through divorce.', 'Monday 7:00 PM', 'Room 104', 'support,divorce', 'support,divorce,care', 'divorce-care'),
('GRP00000028', 'CHU00000001', 'Support', 'Grief Support', 1, 0, 1, 'Support group for those dealing with loss.', 'Tuesday 7:00 PM', 'Room 104', 'support,grief', 'support,grief,care', 'grief-support'),
('GRP00000029', 'CHU00000001', 'Support', 'Financial Peace', 1, 0, 1, 'Financial management course using Dave Ramsey''s principles.', 'Thursday 7:00 PM', 'Fellowship Hall', 'support,financial', 'support,financial,peace', 'financial-peace'),

-- Special Events
('GRP00000030', 'CHU00000001', 'Events', 'Vacation Bible School', 1, 1, 1, 'Annual summer program for children.', 'Summer', 'Various', 'events,vbs', 'events,vbs,summer', 'vacation-bible-school');

-- Group Memberships
INSERT INTO groupMembers (id, churchId, groupId, personId, joinDate, leader) VALUES
-- Worship Services (Everyone attends main service)
('GME00000001', 'CHU00000001', 'GRP00000001', 'PER00000001', '2024-01-01', 1), -- John Smith (leader)
('GME00000002', 'CHU00000001', 'GRP00000001', 'PER00000002', '2024-01-01', 0), -- Mary Smith
('GME00000003', 'CHU00000001', 'GRP00000001', 'PER00000003', '2024-01-01', 0), -- James Smith
('GME00000004', 'CHU00000001', 'GRP00000001', 'PER00000004', '2024-01-01', 0), -- Sarah Smith
('GME00000005', 'CHU00000001', 'GRP00000001', 'PER00000005', '2024-01-01', 0), -- Michael Smith
-- Add more main service members...

-- Sunday School Classes
('GME00000006', 'CHU00000001', 'GRP00000004', 'PER00000001', '2024-01-01', 1), -- John Smith (Adult Bible Class leader)
('GME00000007', 'CHU00000001', 'GRP00000004', 'PER00000002', '2024-01-01', 0), -- Mary Smith
('GME00000008', 'CHU00000001', 'GRP00000004', 'PER00000025', '2024-01-01', 0), -- Richard Miller
('GME00000009', 'CHU00000001', 'GRP00000004', 'PER00000026', '2024-01-01', 0), -- Susan Miller
('GME00000010', 'CHU00000001', 'GRP00000005', 'PER00000027', '2024-01-01', 1), -- Michael Davis (Young Adults leader)
('GME00000011', 'CHU00000001', 'GRP00000005', 'PER00000028', '2024-01-01', 0), -- Emily Davis
('GME00000012', 'CHU00000001', 'GRP00000005', 'PER00000042', '2024-01-01', 0), -- David Lopez
('GME00000013', 'CHU00000001', 'GRP00000005', 'PER00000043', '2024-01-01', 0), -- Laura Lopez
('GME00000014', 'CHU00000001', 'GRP00000006', 'PER00000054', '2024-01-01', 1), -- William Anderson (Senior Adults leader)
('GME00000015', 'CHU00000001', 'GRP00000006', 'PER00000073', '2024-01-01', 0), -- George Thompson
('GME00000016', 'CHU00000001', 'GRP00000006', 'PER00000074', '2024-01-01', 0), -- Margaret Thompson

-- Children's Ministry
('GME00000017', 'CHU00000001', 'GRP00000007', 'PER00000029', '2024-01-01', 0), -- Olivia Davis (Nursery)
('GME00000018', 'CHU00000001', 'GRP00000007', 'PER00000030', '2024-01-01', 0), -- Noah Davis (Nursery)
('GME00000019', 'CHU00000001', 'GRP00000008', 'PER00000032', '2024-01-01', 0), -- Lucas Rodriguez (Preschool)
('GME00000020', 'CHU00000001', 'GRP00000008', 'PER00000033', '2024-01-01', 0), -- Mia Rodriguez (Preschool)
('GME00000021', 'CHU00000001', 'GRP00000009', 'PER00000003', '2024-01-01', 0), -- James Smith (Elementary K-2)
('GME00000022', 'CHU00000001', 'GRP00000009', 'PER00000004', '2024-01-01', 0), -- Sarah Smith (Elementary K-2)
('GME00000023', 'CHU00000001', 'GRP00000010', 'PER00000038', '2024-01-01', 0), -- Diego Hernandez (Elementary 3-5)
('GME00000024', 'CHU00000001', 'GRP00000010', 'PER00000039', '2024-01-01', 0), -- Valentina Hernandez (Elementary 3-5)

-- Youth Ministry
('GME00000025', 'CHU00000001', 'GRP00000011', 'PER00000018', '2024-01-01', 0), -- Matthew Jones (Middle School)
('GME00000026', 'CHU00000001', 'GRP00000011', 'PER00000019', '2024-01-01', 0), -- Sophia Jones (Middle School)
('GME00000027', 'CHU00000001', 'GRP00000011', 'PER00000020', '2024-01-01', 0), -- Ethan Smith (Middle School)
('GME00000028', 'CHU00000001', 'GRP00000012', 'PER00000051', '2024-01-01', 0), -- Andrew Wilson (High School)
('GME00000029', 'CHU00000001', 'GRP00000012', 'PER00000052', '2024-01-01', 0), -- Emma Thompson (High School)
('GME00000030', 'CHU00000001', 'GRP00000013', 'PER00000018', '2024-01-01', 0), -- Matthew Jones (Youth Group)
('GME00000031', 'CHU00000001', 'GRP00000013', 'PER00000019', '2024-01-01', 0), -- Sophia Jones (Youth Group)
('GME00000032', 'CHU00000001', 'GRP00000013', 'PER00000020', '2024-01-01', 0), -- Ethan Smith (Youth Group)
('GME00000033', 'CHU00000001', 'GRP00000013', 'PER00000051', '2024-01-01', 0), -- Andrew Wilson (Youth Group)
('GME00000034', 'CHU00000001', 'GRP00000013', 'PER00000052', '2024-01-01', 0), -- Emma Thompson (Youth Group)

-- Small Groups
('GME00000035', 'CHU00000001', 'GRP00000014', 'PER00000027', '2024-01-01', 1), -- Michael Davis (Young Families leader)
('GME00000036', 'CHU00000001', 'GRP00000014', 'PER00000028', '2024-01-01', 0), -- Emily Davis
('GME00000037', 'CHU00000001', 'GRP00000014', 'PER00000056', '2024-01-01', 0), -- Christopher Thomas
('GME00000038', 'CHU00000001', 'GRP00000014', 'PER00000057', '2024-01-01', 0), -- Amanda Thomas
('GME00000039', 'CHU00000001', 'GRP00000015', 'PER00000025', '2024-01-01', 1), -- Richard Miller (Empty Nesters leader)
('GME00000040', 'CHU00000001', 'GRP00000015', 'PER00000026', '2024-01-01', 0), -- Susan Miller
('GME00000041', 'CHU00000001', 'GRP00000015', 'PER00000061', '2024-01-01', 0), -- Robert Moore
('GME00000042', 'CHU00000001', 'GRP00000015', 'PER00000062', '2024-01-01', 0), -- Patricia Moore
('GME00000043', 'CHU00000001', 'GRP00000016', 'PER00000001', '2024-01-01', 1), -- John Smith (Men's Bible Study leader)
('GME00000044', 'CHU00000001', 'GRP00000016', 'PER00000016', '2024-01-01', 0), -- Thomas Jones
('GME00000045', 'CHU00000001', 'GRP00000016', 'PER00000021', '2024-01-01', 0), -- Carlos Garcia
('GME00000046', 'CHU00000001', 'GRP00000016', 'PER00000036', '2024-01-01', 0), -- Miguel Hernandez
('GME00000047', 'CHU00000001', 'GRP00000017', 'PER00000002', '2024-01-01', 1), -- Mary Smith (Women's Bible Study leader)
('GME00000048', 'CHU00000001', 'GRP00000017', 'PER00000017', '2024-01-01', 0), -- Rebecca Jones
('GME00000049', 'CHU00000001', 'GRP00000017', 'PER00000022', '2024-01-01', 0), -- Maria Garcia
('GME00000050', 'CHU00000001', 'GRP00000017', 'PER00000037', '2024-01-01', 0), -- Ana Hernandez

-- Music Ministry
('GME00000051', 'CHU00000001', 'GRP00000018', 'PER00000002', '2024-01-01', 1), -- Mary Smith (Adult Choir leader)
('GME00000052', 'CHU00000001', 'GRP00000018', 'PER00000017', '2024-01-01', 0), -- Rebecca Jones
('GME00000053', 'CHU00000001', 'GRP00000018', 'PER00000022', '2024-01-01', 0), -- Maria Garcia
('GME00000054', 'CHU00000001', 'GRP00000019', 'PER00000027', '2024-01-01', 1), -- Michael Davis (Praise Team leader)
('GME00000055', 'CHU00000001', 'GRP00000019', 'PER00000028', '2024-01-01', 0), -- Emily Davis
('GME00000056', 'CHU00000001', 'GRP00000019', 'PER00000042', '2024-01-01', 0), -- David Lopez
('GME00000057', 'CHU00000001', 'GRP00000020', 'PER00000003', '2024-01-01', 0), -- James Smith (Children's Choir)
('GME00000058', 'CHU00000001', 'GRP00000020', 'PER00000004', '2024-01-01', 0), -- Sarah Smith (Children's Choir)
('GME00000059', 'CHU00000001', 'GRP00000020', 'PER00000038', '2024-01-01', 0), -- Diego Hernandez (Children's Choir)
('GME00000060', 'CHU00000001', 'GRP00000020', 'PER00000039', '2024-01-01', 0), -- Valentina Hernandez (Children's Choir)

-- Outreach Ministry
('GME00000061', 'CHU00000001', 'GRP00000021', 'PER00000016', '2024-01-01', 1), -- Thomas Jones (Food Pantry leader)
('GME00000062', 'CHU00000001', 'GRP00000021', 'PER00000017', '2024-01-01', 0), -- Rebecca Jones
('GME00000063', 'CHU00000001', 'GRP00000021', 'PER00000021', '2024-01-01', 0), -- Carlos Garcia
('GME00000064', 'CHU00000001', 'GRP00000022', 'PER00000036', '2024-01-01', 1), -- Miguel Hernandez (Missions leader)
('GME00000065', 'CHU00000001', 'GRP00000022', 'PER00000037', '2024-01-01', 0), -- Ana Hernandez
('GME00000066', 'CHU00000001', 'GRP00000022', 'PER00000044', '2024-01-01', 0), -- Roberto Gonzalez
('GME00000067', 'CHU00000001', 'GRP00000023', 'PER00000075', '2024-01-01', 1), -- Steven White (Community Service leader)
('GME00000068', 'CHU00000001', 'GRP00000023', 'PER00000076', '2024-01-01', 0), -- Melissa White
('GME00000069', 'CHU00000001', 'GRP00000023', 'PER00000061', '2024-01-01', 0), -- Robert Moore

-- Special Ministries
('GME00000070', 'CHU00000001', 'GRP00000024', 'PER00000054', '2024-01-01', 1), -- William Anderson (Prayer Team leader)
('GME00000071', 'CHU00000001', 'GRP00000024', 'PER00000073', '2024-01-01', 0), -- George Thompson
('GME00000072', 'CHU00000001', 'GRP00000024', 'PER00000074', '2024-01-01', 0), -- Margaret Thompson
('GME00000073', 'CHU00000001', 'GRP00000025', 'PER00000068', '2024-01-01', 1), -- Kevin Martin (Greeters leader)
('GME00000074', 'CHU00000001', 'GRP00000025', 'PER00000069', '2024-01-01', 0), -- Rachel Martin
('GME00000075', 'CHU00000001', 'GRP00000025', 'PER00000079', '2024-01-01', 0), -- Brian Harris
('GME00000076', 'CHU00000001', 'GRP00000026', 'PER00000056', '2024-01-01', 1), -- Christopher Thomas (Ushers leader)
('GME00000077', 'CHU00000001', 'GRP00000026', 'PER00000075', '2024-01-01', 0), -- Steven White
('GME00000078', 'CHU00000001', 'GRP00000026', 'PER00000080', '2024-01-01', 0), -- Donald Clark

-- Support Groups
('GME00000079', 'CHU00000001', 'GRP00000027', 'PER00000031', '2024-01-01', 1), -- Sofia Rodriguez (Divorce Care leader)
('GME00000080', 'CHU00000001', 'GRP00000027', 'PER00000070', '2024-01-01', 0), -- Michelle Lee
('GME00000081', 'CHU00000001', 'GRP00000028', 'PER00000073', '2024-01-01', 1), -- George Thompson (Grief Support leader)
('GME00000082', 'CHU00000001', 'GRP00000028', 'PER00000074', '2024-01-01', 0), -- Margaret Thompson
('GME00000083', 'CHU00000001', 'GRP00000029', 'PER00000056', '2024-01-01', 1), -- Christopher Thomas (Financial Peace leader)
('GME00000084', 'CHU00000001', 'GRP00000029', 'PER00000057', '2024-01-01', 0), -- Amanda Thomas
('GME00000085', 'CHU00000001', 'GRP00000029', 'PER00000068', '2024-01-01', 0), -- Kevin Martin
('GME00000086', 'CHU00000001', 'GRP00000029', 'PER00000069', '2024-01-01', 0), -- Rachel Martin

-- Special Events (VBS)
('GME00000087', 'CHU00000001', 'GRP00000030', 'PER00000003', '2024-01-01', 0), -- James Smith
('GME00000088', 'CHU00000001', 'GRP00000030', 'PER00000004', '2024-01-01', 0), -- Sarah Smith
('GME00000089', 'CHU00000001', 'GRP00000030', 'PER00000005', '2024-01-01', 0), -- Michael Smith
('GME00000090', 'CHU00000001', 'GRP00000030', 'PER00000032', '2024-01-01', 0), -- Lucas Rodriguez
('GME00000091', 'CHU00000001', 'GRP00000030', 'PER00000033', '2024-01-01', 0), -- Mia Rodriguez
('GME00000092', 'CHU00000001', 'GRP00000030', 'PER00000038', '2024-01-01', 0), -- Diego Hernandez
('GME00000093', 'CHU00000001', 'GRP00000030', 'PER00000039', '2024-01-01', 0), -- Valentina Hernandez
('GME00000094', 'CHU00000001', 'GRP00000030', 'PER00000040', '2024-01-01', 0), -- Gabriel Hernandez
('GME00000095', 'CHU00000001', 'GRP00000030', 'PER00000041', '2024-01-01', 0); -- Isabella Hernandez

-- Create Demo User
INSERT INTO users (id, email, password, displayName, firstName, lastName, registrationDate) VALUES
('USR00000001', 'demo@chums.org', '$2a$10$8K1p/a0dR1xqM8K1p/a0dR1xqM8K1p/a0dR1xqM8K1p/a0dR1xqM', 'Demo User', 'Demo', 'User', '2024-01-01 00:00:00');

-- Create Domain Admin Role
INSERT INTO roles (id, churchId, name) VALUES
('ROL00000001', 'CHU00000001', 'Domain Admins');

-- Add Role Permissions
INSERT INTO rolePermissions (id, churchId, roleId, apiName, contentType, action) VALUES
('RPM00000001', 'CHU00000001', 'ROL00000001', 'MembershipApi', 'Domain', 'Admin');

-- Add User to Role
INSERT INTO roleMembers (id, churchId, roleId, userId, dateAdded) VALUES
('RME00000001', 'CHU00000001', 'ROL00000001', 'USR00000001', '2024-01-01 00:00:00');
