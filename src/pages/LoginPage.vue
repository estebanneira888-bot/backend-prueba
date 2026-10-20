<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-md shadow-2 login-card" style="width: 400px;">
      <q-card-section class="text-center">
        <div class="text-grey-7 text-subtitle2">ACCESO INSTITUTIONAL</div>
        <div class="text-h5 text-weight-bold text-primary q-mt-sm">Bienvenido de nuevo</div>
        <div class="text-grey-6 text-caption q-mt-xs">Ingresa tus credenciales para continuar.</div>
      </q-card-section>

      <q-card-section>
        <!-- 1. El atributo 'novalidate' apaga por completo las alertas de Windows/Navegador -->
        <q-form @submit="onLogin" class="q-gutter-md" novalidate>
          
          <!-- 2. Agregamos las propiedades 'rules' y 'lazy-rules' para activar las alertas de Quasar -->
          <q-input
            v-model="email"
            type="email"
            label="Correo institucional"
            outlined
            lazy-rules
            :rules="[
              val => !!val || 'El correo institucional es obligatorio',
              val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'El correo no tiene un formato válido'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="email" color="primary" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            type="password"
            label="Contraseña"
            outlined
            lazy-rules
            :rules="[val => !!val || 'La contraseña es obligatoria']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="primary" />
            </template>
          </q-input>

          <div class="q-mt-lg">
            <q-btn
              type="submit"
              label="Ingresar al panel"
              icon="login"
              color="primary"
              class="full-width text-weight-bold"
              size="lg"
              unevaluated
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-6 text-caption flex items-center justify-center">
          <q-icon name="security" color="primary" class="q-mr-xs" size="xs" />
          El acceso es exclusivo para cuentas autorizadas por un administrador.
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const email = ref('')
    const password = ref('')

    const onLogin = () => {
      // Tu lógica actual para conectar con el Backend ("backend prueba")
      console.log('Enviando datos...', email.value, password.value)
    }

    return {
      email,
      password,
      onLogin
    }
  }
}
</script>

<style scoped>
.login-card {
  border-radius: 12px;
}
</style>
