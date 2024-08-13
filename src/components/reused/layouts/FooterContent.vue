<template>
  <v-row class="mt-0 mb-0 pb-0 pt-1" align-content="start">
    <v-col
        sm="2"
        md="4"
        lg="3"
        xl="3"
        class="text-right bot_logo pt-0 hidden-xs-only"
        align-self="start">
      <img alt="" class="mt-1" :src="'/public/logo.png'">
    </v-col>
    <v-col
        cols="12"
        sm="9"
        md="7"
        lg="8"
        xl="8"
        class="text-left footer_content">
      <v-row class="hidden-xs-only">
        <v-col cols="12">
          <div class="cr">
            {{ "Мы следим за тобой." }}
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<style scoped>
.bot_logo {
  width: 7%;
  margin-right: 18px;
 }

.footer_content {
  max-width: 1200px;
  box-sizing: content-box;
}

.bot_logo img {
  height: 54px;
}

.cr {
  margin: 6px 0 0 0;
  line-height: 16px;
  color: #9d9d9d;
}

div.col-md-12.col-12 {
  padding: 0;
}

div.col.col-12 {
  padding: 0;
}

</style>

<style>
footer {
  position: absolute;
  bottom: -20px;
  left: 0;
  width: 100%;
  padding-top: 0px!important;
  padding-bottom: 55px;
  font-size: 12px;
  background: #f7f7f7;
  border-top: 1px solid #d8d8d8;
}
</style>

<script lang="ts" setup>

</script>
