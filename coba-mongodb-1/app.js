const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

const uri = 'mongodb://127.0.0.1:27017'; // localhost
const dbName = 'wpu' // nama dbnya

// inisiasi mongoclient
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect((error, client) => {
    if(error){
        return console.log('Koneksi gagal.')
    }

    // pilih database
    const db = client.db(dbName);

    // menambahkan 1 data ke collection mahasiswa
    // db.collection('mahasiswa').insertOne({
    //     nama: 'indi',
    //     email: 'indi@gmail.com'
    // }, (error, result) => {
    //     if(error) { // kalau gagal
    //         return console.log('gagal menambahkan data.');
    //     }

    //     // kalau berhasil
    //     console.log(result);

    // });


    // menambahkan lebih dari 1 data
    // db.collection('mahasiswa').insertMany([
    //     {
    //         nama: 'liqa',
    //         email: 'liqa@yahoo.com'
    //     },
    //     {
    //         nama: 'aviv',
    //         email: 'aviv@gmail.com'
    //     }
    // ], (error,result) => {
    //     if(error) { // kalau gagal
    //         return console.log('gagal menambahkan data.');
    //     }
        
    //     // kalau berhasil
    //     console.log(result);
    // });


    // menampilkan semua data pada collection
    // console.log(db.collection('mahasiswa').find().toArray((error, result) => {console.log(result)} ));

    // menampilkan semua data pada collection berdasarkan kriteria
    // console.log(db.collection('mahasiswa').find( { _id: ObjectID('624eb5b339204e24247cd6ad') } ).toArray((error, result) => {console.log(result)} ));


    // mengubah data berdasarkan id
    // const updatePromise = db.collection('mahasiswa').updateOne(
    //     {
    //         _id: ObjectID('624eb5b339204e24247cd6ad') // masukan kriteria id
    //     },
    //     {
    //         $set: {
    //             nama: 'liqa' // ubah namanya
    //         }
    //     }
    // );

    // updatePromise.then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // });



    // // mengubah lebih dari 1 data berdasarkan kriteria
    // db.collection('mahasiswa').updateMany(
    //     {
    //         nama: 'Aqil'
    //     },
    //     {
    //         $set: {
    //             nama: 'Aqil Emeraldi'
    //         }
    //     }
    // )



    // menghapus 1 data
    // db.collection('mahasiswa').deleteOne(
    //     {
    //         _id: ObjectID('624eb5b339204e24247cd6ad')
    //     }).then((result) => {
    //         console.log(result);
    //     }).catch((error) => {
    //         console.log(error);
    // });

    // menghapus lebih dari 1 data
    db.collection('mahasiswa').deleteMany(
        {
            nama: 'indi'
        }).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
    });


});