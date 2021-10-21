<template>
    <div>
        <Header />
            <div class="container">
            <button type="button" v-if="rol == 'admin'" class="btn btn-primary" v-on:click="openModalNuevoGrupo">Crear grupo</button> 
            <button type="button" v-if="rol == 'admin'" class="btn btn-warning" v-on:click="openModalNuevoAdmin">Crear Adminisrador</button> 
            <button type="button" class="btn btn-secondary" v-on:click="cerrarSesion">Cerrar Sesiòn</button> <br><br>
            <br><br>
            <h2>Lista de grupos</h2>
                <table class="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="group in groups" :key="group.id">
                            <th scope="row">{{group.id}}</th>
                            <td>{{group.name}}</td>
                            <td>{{group.description}}</td>
                            <td>
                                <button type="button" style="color: white;" class="btn btn-info" v-on:click="openModalVer(group.id)">Ver miembros</button>
                                <button type="button" v-if="rol == 'user'" style="color: white;" class="btn btn-success" v-on:click="nuevoMiembro(group.id)">Unirme</button>
                                <button type="button" v-if="rol == 'admin'" style="color: white;" class="btn btn-danger" v-on:click="deleteGroup(group.id)">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- Modal nuevo grupo -->
                <modal name="nuevo_grupo" >
                    <div class="container-fluid" style="height: 100px;">  
                        <br><br>
                        <form>
                        <div class="form-group">
                            <label for="name">Nombre:</label>
                            <input type="text" class="form-control" id="name" placeholder="Nombre" v-model="new_group_name">
                        </div>
                        <div class="form-group">
                            <label for="description">Descripción:</label>
                            <input type="text" class="form-control" id="description" placeholder="Descripción" v-model="new_group_description">
                        </div>
                        <br>
                        <button type="button" class="btn btn-primary" v-on:click="saveGroup">Guardar</button>
                        </form>
                    </div>    
                </modal>
                 <!-- Modal nuevo admin -->
                <modal name="nuevo_admin" >
                    <div class="container-fluid" style="height: 200px;">  
                        <br>
                        <form>
                            <div class="form-group">
                                <label for="name">Nombre:</label>
                                <input type="text" class="form-control" id="name" placeholder="Nombre" v-model="new_admin_name">
                            </div>
                            <div class="form-group">
                                <label for="email">email:</label>
                                <input type="text" class="form-control" id="email" placeholder="Email" v-model="new_admin_email">
                            </div>
                            <div class="form-group">
                                <label for="password">Password:</label>
                                <input type="text" class="form-control" id="password" placeholder="Password" v-model="new_admin_password">
                            </div>
                            <br>
                            <button type="button" class="btn btn-primary" style="margin-bottom: 30px;" v-on:click="saveAdmin">Guardar</button>
                            
                        </form>
                    </div>    
                </modal>
                <!-- Modal ver miembros -->
                <modal name="members" >
                    <div class="container-fluid" style="height: 100px;">  
                        <br><br>
                        <form>
                            <div class="form-group">
                                <label for="exampleFormControlSelect1"><strong>Miembros</strong></label>
                                
                                <ol class="list-group" v-for="member in group_members" :key="member.id">
                                    <li class="list-group-item">{{member.name}}</li>
                                </ol>
                            </div><br>
                        </form>
                    </div>    
                </modal>
            </div>
        <Footer />
    </div>
</template>
<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

import axios from 'axios';

    export default {
        name: "Dashboard",
        data(){
            return {
                groups: '',
                group_members: '',
                rol: '',
                new_group_name: '',
                new_group_description: '',
                new_admin_name: '',
                new_admin_email: '',
                new_admin_password: '',
                new_admin_rol: ''
            }
        },
        components: {
            Header,
            Footer,
        },
        mounted: function() {

            if(!localStorage.token) {
                this.$router.push('/');
            }

            this.rol = localStorage.role;

            this.getGroups();
           
        },
        methods: {
            getGroups() {
                 const config = {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            };

                let url_groups = process.env.VUE_APP_URL+'/api/auth/groups';

                axios.get(url_groups, config).then(data => {
                    this.groups = data.data.groups;  
                })
            },
            cerrarSesion: function() {
                this.$router.push('/');
            },
            nuevoMiembro: function(id) {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.token}` }
                };

                const url = process.env.VUE_APP_URL+'/api/auth/user-group';
 
                axios.post(url, { group_id: id }, config)
                    .then(data => {
                     alert(data.data.message);
                     });
            },
            openModalNuevoGrupo: function() {
                this.$modal.show('nuevo_grupo');
            },
            openModalNuevoAdmin: function() {
                this.$modal.show('nuevo_admin');
            },
            openModalVer: function(id) {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.token}` }
                };

                const url = process.env.VUE_APP_URL+'/api/auth/users-group/'+id;

                axios.get(url, config)
                    .then(data => {
                        
                       this.group_members = data.data.members; 
                       console.log(this.group_members);
                     });

                this.$modal.show('members');

            },
            onChange: function(e){
                this.interes_selected = e.target.value;
                console.log('selected', this.interes_selected)
            },
            saveGroup: function() {
                const headers = { 
                    "Authorization": `Bearer ${localStorage.token}`,
                };

                const url_save = process.env.VUE_APP_URL+'/api/auth/save-group';

                const group = { name: this.new_group_name, description: this.new_group_description };
                axios.post(url_save, group, { headers })
                    .then(response => {
                        console.log(response);
                        this.getGroups();
                        alert('Grupo Creado!');
                    });

                    this.$modal.hide('nuevo_grupo');
            },
            saveAdmin: function() {
                const url_save = process.env.VUE_APP_URL+'/api/auth/signup';

                const group = { name: this.new_admin_name, email: this.new_admin_email, password: this.new_admin_password, rol: 'admin' };
                axios.post(url_save, group)
                    .then(response => {
                        console.log(response);
                        alert('Administrador creado!');
                    });

                    this.$modal.hide('nuevo_admin');
            },
            deleteGroup: function(id) {
                const headers = { 
                    "Authorization": `Bearer ${localStorage.token}`,
                };

                const url_delete = process.env.VUE_APP_URL+'/api/auth/delete';

                let r = confirm("¿Desea eliminar el grupo?");
                
                if (r == true) {
                    axios.post(url_delete, { id: id }, { headers })
                        .then(response => {
                            console.log(response);
                            this.getGroups();
                            alert('Grupo Eliminado!');
                        });
                } 
            }
        }   
    }

</script>
<style scoped>
button {
    margin: 5px;
}
</style>