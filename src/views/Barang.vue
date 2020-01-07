<template>
    <v-container>
        <v-card>
            <v-container grid-list-md mb-0>
                <h2 class="text-md-center">Data Barang</h2>
                <v-layout row wrap style="margin:10px">
                    <v-flex xs6>
                        <v-btn depressed dark rounded style="text-transform: none !important;" color="green accent-3"
                            @click="dialog = true">
                            <v-icon size="18" class="mr-2">mdi-pencil-plus</v-icon>
                            Tambah Barang
                        </v-btn>
                    </v-flex>
                    <v-flex xs6 class="text-right">
                        <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details>
                        </v-text-field>
                    </v-flex>
                </v-layout>
                <v-data-table :headers="headers" :items="barangs" :search="keyword" :loading="load">
                    <template v-slot:body="{ items }">
                        <tbody>
                            <tr v-for="(item,index) in items" :key="item.id">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.pegawai }}</td>
                                <td>{{ item.nama_barang}}</td>
                                <td>{{ item.harga_barang }}</td>
                                <td class="text-center">
                                    <v-btn icon color="indigo" light @click="editHandler(item)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn icon color="error" light @click="deleteData(item.id)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-data-table>
            </v-container>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ jenisInput }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Nama Pegawai" v-model="form.nama_pegawai" required>
                            </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Nama Barang" v-model="form.nama_barang" required>
                                    </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Harga Barang" v-model="form.harga_barang" type="number" required></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
                        <v-btn color="blue darken-1" text @click="setForm()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="3000">
            {{ text }}
            <v-btn dark text @click="snackbar = false">
                Close
            </v-btn>
        </v-snackbar>
    </v-container>
</template>
<script>
    export default {
        data() {
            return {
                dialog: false,
                keyword: '',
                headers: [{
                        text: 'No',
                        value: 'no',
                    },
                     {
                        text: 'Nama Pegawai',
                        value: 'nama_pegawai'
                    },
                    {
                        text: 'Nama Barang',
                        value: 'nama_barang'
                    },
                    {
                        text: 'Harga Barang',
                        value: 'harga_barang'
                    },
                    {
                        text: 'Aksi',
                        value: null
                    },
                ],
                barangs: [],
                snackbar: false,
                color: null,
                text: '',
                load: false,
                form: {
                    nama_pegawai: '',
                    nama_barang: '',
                    harga_barang: null,
                },
                barang: new FormData,
                typeInput: 'new',
                errors: '',
                updatedId: null,
                deleteId: null,
                jenisInput: 'Buat Barang',
            }
        },
        methods: {
            getData() {
                var uri = this.$apiUrl + 'barangs/'
                this.$http.get(uri).then(response => {
                    this.barangs = response.data
                })
            },
            sendData() {
                this.barang.append('nama_pegawai', this.form.nama_pegawai);
                this.barang.append('nama_barang', this.form.nama_barang);
                this.barang.append('harga_barang', this.form.harga_barang);
                var uri = this.$apiUrl + 'barangs/'
                this.load = true
                this.$http.post(uri, this.form).then(response => {
                    this.snackbar = true; //mengaktifkan snackbar
                    this.color = 'green'; //memberi warna snackbar
                    this.text = response.data.message; //memasukkan pesan ke snackbar
                    this.load = false;
                    this.dialog = false
                    this.getData(); //mengambil data user
                    this.resetForm();
                }).catch(error => {
                    this.errors = error
                    this.snackbar = true;
                    this.text = 'Try Again';
                    this.color = 'red';
                    this.load = false;
                })
            },
            updateData() {
                this.barang.append('nama_pegawai', this.form.nama_pegawai);
                this.barang.append('nama_barang', this.form.nama_barang);
                this.barang.append('harga_barang', this.form.harga_barang);
                var uri = this.$apiUrl + 'barangs/' + this.updatedId + '/';
                this.load = true
                this.$http.put(uri, this.barang).then(response => {
                    this.snackbar = true; //mengaktifkan snackbar
                    this.color = 'green'; //memberi warna snackbar
                    this.text = response.data.message; //memasukkan pesan ke snackbar
                    this.load = false;
                    this.dialog = false
                    this.getData(); //mengambil data user
                    
                    this.typeInput = 'new';
                }).catch(error => {
                    this.errors = error
                    this.snackbar = true;
                    this.text = 'Try Again';
                    this.color = 'red';
                    this.load = false;
                    this.typeInput = 'new';
                })
            },
            editHandler(item) {
                this.typeInput = 'edit';
                this.jenisInput = 'Edit Barang';
                this.dialog = true;
                this.form.nama_pegawai = item.nama_pegawai;
                this.form.nama_barang = item.nama_barang;
                this.form.harga_barang = item.harga_barang;
                this.updatedId = item.id_barang;
            },
            deleteData(deleteId) { //mengahapus data
                var uri = this.$apiUrl +
                    'barangs/' + deleteId + '/'; //data dihapus berdasarkan id
                this.$http.delete(uri).then(response => {
                    this.snackbar = true;
                    this.text = response.data.message;
                    this.color = 'green'
                    this.deleteDialog = false;
                    this.getData();
                }).catch(error => {
                    this.errors = error
                    this.snackbar = true;
                    this.text = 'Try Again';
                    this.color = 'red';
                })
            },
            setForm() {
                if (this.typeInput === 'new') {
                    this.sendData()
                } else {
                    console.log("dddd")
                    this.updateData()
                }
            },
            resetForm() {
                this.form = {
                    nama_pegawai: '',
                    nama_barang: '',
                    harga_barang: null,
                }
            }
        },
        mounted() {
            this.getData();
            
        },
    } 
    </script>
