<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app color="cyan" >
      
      <v-list dense>
        <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="white--text">TES</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
        <v-divider></v-divider>
        <v-list-item router to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item router to="/user">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">User</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item router to="/barang">
          <v-list-item-action>
            <v-icon>mdi-note-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">Barang</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block>Logout</v-btn>
        </div>
      </template>
      
    </v-navigation-drawer>
    <v-app-bar app color="cyan" >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="white--text">PT XXX</v-toolbar-title>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
    
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: true,
    }),

  };
</script>