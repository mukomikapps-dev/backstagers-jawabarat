-- Delete old structure data
DELETE FROM structure;

-- Insert new organizational structure
INSERT INTO structure (name, position, title, phone, email, bio, department) VALUES
('Roni Patoroni', 'Ketua DPD Jawa Barat', 'Chairman - West Java Regional', '', '', 'Pemimpin DPD Jawa Barat', 'Leadership'),
('Herlan Susila', 'Sekretaris', 'Secretary', '', '', 'Sekretaris DPD Jawa Barat', 'Administration'),
('Endang Priandari', 'Bendahara', 'Treasurer', '', '', 'Bendahara DPD Jawa Barat', 'Finance'),
('Sofyan Nasution', 'Ketua Umum', 'General Chairman', '', '', 'Ketua Umum Organisasi', 'Leadership'),
('Inge Suprayogi', 'KIBD 1 - Diklat Litbang', 'KIBD 1 - Training & Research', '', '', 'Kepala Bidang Diklat Litbang', 'Development'),
('Santy Soekarno', 'KIBD 1 - Diklat Litbang', 'KIBD 1 - Training & Research', '', '', 'Bidang Diklat Litbang', 'Development'),
('Adhitya Permana', 'KIBD 2 - Pengembangan Wilayah', 'KIBD 2 - Regional Development', '', '', 'Kepala Bidang Pengembangan Wilayah', 'Development'),
('Roni SSP', 'KIBD 2 - Pengembangan Wilayah', 'KIBD 2 - Regional Development', '', '', 'Bidang Pengembangan Wilayah', 'Development'),
('Gio-ATAP', 'KIBD 3 - Markom', 'KIBD 3 - Marketing Communication', '', '', 'Kepala Bidang Markom', 'Marketing'),
('Reky Hermawan', 'KIBD 3 - Markom', 'KIBD 3 - Marketing Communication', '', '', 'Bidang Markom', 'Marketing'),
('Bayu Subekti', 'KIBD 4 - Keanggotaan', 'KIBD 4 - Membership', '', '', 'Kepala Bidang Keanggotaan', 'Membership'),
('Riksa LPR', 'KIBD 5 - Sosial & Kemasyarakatan', 'KIBD 5 - Social & Community', '', '', 'Kepala Bidang Sosial & Kemasyarakatan', 'Social');
