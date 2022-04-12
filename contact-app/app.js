const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const { body, validationResult, check } = require('express-validator');

// method override (agar bisa pakai http verb : PUT, DELETE)
const methodOverride = require('method-override');

// module untuk flash-data, session dan cookie
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// koneksi ke db
require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;

// setup method override
app.use(methodOverride('_method'));

// SETUP EJS
app.set('view engine', 'ejs');
app.use(expressLayouts); 
app.use(express.static('public'));
app.use(express.urlencoded({extended: true})); 

// Konfigurasi flash
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: {maxAge:6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// halaman home
app.get('/', (req, res) => {

    const mahasiswa = [
      {
        nama: 'Aqil Emeraldi',
        email: 'aqil@gmail.com'
      },
      {
        nama: 'Erik',
        email: 'erk@gmail.com'
      },
      {
        nama: 'Doddy',
        email: 'doddy@gmail.com'
      }
    ]

    res.render('index', {layout: 'layouts/main-layout', nama: 'Aqil Emeraldi', title: 'Halaman Home', mahasiswa});
});

// halaman about
app.get('/about', (req, res) => {
    res.render('about', {layout: 'layouts/main-layout', title: 'Halaman About'});
});

// halaman contact
app.get('/contact', async (req, res) => {
    const contacts = await Contact.find(); 

    res.render('contact', {
      layout: 'layouts/main-layout', 
      title: 'Halaman Contact',
      contacts,
      msg: req.flash('msg'),
    });
});

// route form tambah kontak
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    title: 'Form Tambah Data Kontak',
    layout: 'layouts/main-layout',
  })
});

// route proses tambah data kontak
app.post('/contact', [

  // untuk express-validatornya
  body('nama').custom(async (value) => { // membuat validator baru
    const duplikat = await Contact.findOne({nama: value}); // cek apakah ada duplikat
    if(duplikat) { // kalo ada duplikat
      throw new Error('Nama kontak sudah digunakan!');
    }
    return true; // hasil jika tidak ada duplikat
  }),
  check('email', 'Email tidak valid').isEmail(), // parameter pertama dari name pada form, parameter kedua untuk custom pesan error
  check('noHp', 'No. HP tidak valid').isMobilePhone('id-ID')
], (req, res) => {

  const errors = validationResult(req); // variabel untuk menampung errornya

  if(!errors.isEmpty()) { // cek apakah errornya tidak kosong

    res.render('add-contact', {
      title: 'Form Tambah Data Kontak',
      layout: 'layouts/main-layout',
      errors: errors.array(), // p: jika tidak ada errors maka hasilnya akan undefined
    });

  } else { // jika errorsnya kosong
    Contact.insertMany(req.body, (error, result) => {
      // kirimkan flash message
      req.flash('msg', 'Data kontak berhasil ditambahkan!');
      res.redirect('/contact');
    });

  };

});

// proses delete data (taruh sebelum fungsi detail)
// app.get('/contact/delete/:nama', async (req, res) => {
//   const contact = await Contact.findOne({nama: req.params.nama});
//   if(!contact){
//     res.status(404);
//     res.send('<h1>404</h1>');
//   } else {
//     Contact.deleteOne({ _id: contact._id }).then((result) => {
//       // kirimkan flash message
//       req.flash('msg', 'Data kontak berhasil dihapus!');
//       res.redirect('/contact');
//     });
    
//   }
// });

// proses hapus (versi rapih)
app.delete('/contact', (req, res) => {
  Contact.deleteOne({ nama: req.body.nama }).then((result) => {
    // kirimkan flash message
    req.flash('msg', 'Data kontak berhasil dihapus!');
    res.redirect('/contact');
  });
});

// route ke halaman form ubah data
app.get('/contact/edit/:nama', async (req, res) => {
  const contact = await Contact.findOne({nama: req.params.nama});

  res.render('edit-contact', {
    title: 'Form Ubah Data Kontak',
    layout: 'layouts/main-layout',
    contact,
  })
});

// proses update data
app.put('/contact', [

  // untuk express-validatornya

  body('nama').custom(async (value, {req}) => { // membuat validator baru
    const duplikat = await Contact.findOne({nama: value}); // cek apakah ada duplikat
    if(value !== req.body.oldNama && duplikat) { // cek apakah nama tidak sama dengan nama lama dan cek apakah ada duplikat
      throw new Error('Nama kontak sudah digunakan!');
    }
    return true; // hasil jika tidak ada duplikat
  }),
  check('email', 'Email tidak valid').isEmail(), // parameter pertama dari name pada form, parameter kedua untuk custom pesan error
  check('noHp', 'No. HP tidak valid').isMobilePhone('id-ID')
], (req, res) => {

  const errors = validationResult(req); // variabel untuk menampung errornya

  if(!errors.isEmpty()) { // cek apakah errornya tidak kosong

    res.render('edit-contact', {
      title: 'Form Ubah Data Kontak',
      layout: 'layouts/main-layout',
      errors: errors.array(), // p: jika tidak ada errors maka hasilnya akan undefined
      contact: req.body,
    });

  } else { // jika errorsnya kosong
    Contact.updateOne(
      { _id: req.body._id }, // ubah data berdasarkan ciri id
      { $set: { // yang akan diubah
        nama: req.body.nama, 
        email: req.body.email,
        noHp: req.body.noHp, 
        }
      }
      ).then((result) => {
        // kirimkan flash message
        req.flash('msg', 'Data kontak berhasil diubah!');
        res.redirect('/contact');
      });
    
  };

});

// route detail
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });
  
    res.render('detail', {
      layout: 'layouts/main-layout', 
      title: 'Halaman Detail Kontak',
      contact
    });
  })

app.listen(port, () => {
    console.log(`Mongo Contact App | listening on port http://localhost:${port}`);
});