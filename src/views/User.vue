<template>
    <v-container>
        <v-card>
            <v-container grid-list-md mb-0>
                <h2 class="text-md-center">Data User</h2>
                <v-layout row wrap style="margin:10px">
                    <v-flex xs6>
                        <v-btn depressed dark rounded style="text-transform: none !important;" color="green accent-3"
                            @click="dialog = true">
                            <v-icon size="18" class="mr-2">mdi-pencil-plus</v-icon>
                            Tambah User
                        </v-btn>
                    </v-flex>
                    <v-flex xs6 class="text-right">
                        <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details>
                        </v-text-field>
                    </v-flex>
                </v-layout>
                <v-data-table :headers="headers" :items="users" :search="keyword" :loading="load">
                    <template v-slot:body="{ items }">
                        <tbody>
                            <tr v-for="(item,index) in items" :key="item.id">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.alias}}</td>
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
                    <span class="headline">{{typeInput}}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Name*" v-model="form.name" required>
                                    </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Email*" v-model="form.alias" required></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
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
                        text: 'Name',
                        value: 'name'
                    },
                    {
                        text: 'Alias',
                        value: 'alias'
                    },
                ],
                users: [],
                snackbar: false,
                color: null,
                text: '',
                load: false,
                form: {
                    name: '',
                    email: '',
                    password: ''
                },
                user: new FormData,
                typeInput: 'new',
                errors: '',
                updatedId: null,
                deleteId: null,
            }
        },
        methods: {
            getData() {
                var uri = this.$apiUrl + 'pegawais/'
                this.$http.get(uri).then(response => {
                    this.users = response.data
                })
            },
            sendData() {
                this.user.append('name', this.form.name);
                this.user.append('alias', this.form.alias);
                var uri = this.$apiUrl + 'pegawais/'
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
                this.user.append('name', this.form.name);
                this.user.append('alias', this.form.alias);
                var uri = this.$apiUrl + 'pegawais/' + this.updatedId + '/';
                this.load = true
                this.$http.put(uri, this.user).then(response => {
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
                this.dialog = true;
                this.form.name = item.name;
                this.form.alias = item.alias;
                this.updatedId = item.id;
            },
            deleteData(deleteId) { //mengahapus data
                var uri = this.$apiUrl +
                    'pegawais/' + deleteId + '/'; //data dihapus berdasarkan id
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
                    name: '',
                    alias: ''
                }
            }
        },
        mounted() {
            this.getData();
            
        },
    } 
    </script>
