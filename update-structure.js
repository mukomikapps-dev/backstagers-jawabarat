const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const supabaseUrl = 'https://tqrmfkxpniamvmkwwanj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxcm1ma3hwbmlhbXZta3d3YW5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA5MDE3NSwiZXhwIjoyMDkzNjY2MTc1fQ.VfH9kQXu08gQSwHMM3aK1ZZmv0Ecdna-_irY6rR77Mg';

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { transport: ws }
});

const newData = [
  {
    name: 'Roni Patoroni',
    position: 'Ketua DPD Jawa Barat',
    title: 'Chairman - West Java Regional',
    phone: '',
    email: '',
    bio: 'Pemimpin DPD Jawa Barat',
    department: 'Leadership'
  },
  {
    name: 'Herlan Susila',
    position: 'Sekretaris',
    title: 'Secretary',
    phone: '',
    email: '',
    bio: 'Sekretaris DPD Jawa Barat',
    department: 'Administration'
  },
  {
    name: 'Endang Priandari',
    position: 'Bendahara',
    title: 'Treasurer',
    phone: '',
    email: '',
    bio: 'Bendahara DPD Jawa Barat',
    department: 'Finance'
  },
  {
    name: 'Sofyan Nasution',
    position: 'Ketua Umum',
    title: 'General Chairman',
    phone: '',
    email: '',
    bio: 'Ketua Umum Organisasi',
    department: 'Leadership'
  },
  {
    name: 'Inge Suprayogi',
    position: 'KIBD 1 - Diklat Litbang',
    title: 'KIBD 1 - Training & Research',
    phone: '',
    email: '',
    bio: 'Kepala Bidang Diklat Litbang',
    department: 'Development'
  },
  {
    name: 'Santy Soekarno',
    position: 'KIBD 1 - Diklat Litbang',
    title: 'KIBD 1 - Training & Research',
    phone: '',
    email: '',
    bio: 'Bidang Diklat Litbang',
    department: 'Development'
  },
  {
    name: 'Adhitya Permana',
    position: 'KIBD 2 - Pengembangan Wilayah',
    title: 'KIBD 2 - Regional Development',
    phone: '',
    email: '',
    bio: 'Kepala Bidang Pengembangan Wilayah',
    department: 'Development'
  },
  {
    name: 'Roni SSP',
    position: 'KIBD 2 - Pengembangan Wilayah',
    title: 'KIBD 2 - Regional Development',
    phone: '',
    email: '',
    bio: 'Bidang Pengembangan Wilayah',
    department: 'Development'
  },
  {
    name: 'Gio-ATAP',
    position: 'KIBD 3 - Markom',
    title: 'KIBD 3 - Marketing Communication',
    phone: '',
    email: '',
    bio: 'Kepala Bidang Markom',
    department: 'Marketing'
  },
  {
    name: 'Reky Hermawan',
    position: 'KIBD 3 - Markom',
    title: 'KIBD 3 - Marketing Communication',
    phone: '',
    email: '',
    bio: 'Bidang Markom',
    department: 'Marketing'
  },
  {
    name: 'Bayu Subekti',
    position: 'KIBD 4 - Keanggotaan',
    title: 'KIBD 4 - Membership',
    phone: '',
    email: '',
    bio: 'Kepala Bidang Keanggotaan',
    department: 'Membership'
  },
  {
    name: 'Riksa LPR',
    position: 'KIBD 5 - Sosial & Kemasyarakatan',
    title: 'KIBD 5 - Social & Community',
    phone: '',
    email: '',
    bio: 'Kepala Bidang Sosial & Kemasyarakatan',
    department: 'Social'
  }
];

async function updateStructure() {
  try {
    console.log('Deleting old data...');
    const { error: deleteError } = await supabase
      .from('structure')
      .delete()
      .neq('id', 0);
    
    if (deleteError) {
      console.error('Delete error:', deleteError);
      return;
    }
    
    console.log('Inserting new data...');
    const { data, error: insertError } = await supabase
      .from('structure')
      .insert(newData)
      .select();
    
    if (insertError) {
      console.error('Insert error:', insertError);
      return;
    }
    
    console.log('✅ Success! Inserted', data.length, 'records');
  } catch (error) {
    console.error('Error:', error);
  }
}

updateStructure();
