const mongoose = require('mongoose');

// konek
mongoose.connect('mongodb://127.0.0.1:27017/wpu', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

// coba nambah 1 data
// const contact1 = new Contact({
//     nama: 'Erika',
//     noHp: '08289889663',
//     email: 'erika@gmail.com',
// });

// simpan ke collection
// contact1.save().then((con) => console.log(con) );