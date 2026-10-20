<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { usuariosService } from "../services/usuarios.service";
import { mensajeError } from "../services/api";

const $q = useQuasar();
const vacio = () => ({ nombre: "", email: "", password: "" });
const form = ref(vacio());
const cargando = ref(false);

const guardar = async () => {
  cargando.value = true;
  try {
    const payload = {
      nombre: form.value.nombre.trim(),
      email: form.value.email.trim(),
      password: form.value.password,
    };
    const { data } = await usuariosService.crear(payload);
    $q.notify({ type: "positive", message: data.msg });
    form.value = vacio();
  } catch (e) {
    $q.notify({ type: "negative", message: mensajeError(e) });
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <div>
    <div class="page-header q-mb-lg">
      <div class="page-header-icon amber"><q-icon name="manage_accounts" size="26px" /></div>
      <div class="col">
        <div class="section-title">Usuarios</div>
        <div class="section-sub">Administración de cuentas institucionales</div>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-6">
        <q-card flat class="card-soft">
          <q-card-section class="q-pa-lg">
            <div class="row items-center q-gutter-md">
              <div class="form-badge"><q-icon name="person_add" size="24px" /></div>
              <div class="col">
                <div class="section-title">Nueva cuenta</div>
                <div class="section-sub">Crea credenciales de acceso interno</div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-form @submit.prevent="guardar">
            <q-card-section class="q-gutter-md q-pt-lg">
              <q-input v-model="form.nombre" label="Nombre completo" outlined :rules="[(v) => !!v?.trim() || 'El nombre es obligatorio']">
                <template #prepend><q-icon name="badge" /></template>
              </q-input>
              <q-input v-model="form.email" type="email" label="Correo institucional" outlined :rules="[(v) => !!v?.trim() || 'El correo es obligatorio']">
                <template #prepend><q-icon name="mail" /></template>
              </q-input>
              <q-input v-model="form.password" type="password" label="Contraseña temporal" outlined
                hint="Mínimo 6 caracteres"
                :rules="[(v) => (v && v.length >= 6) || 'Mínimo 6 caracteres']">
                <template #prepend><q-icon name="lock" /></template>
              </q-input>
            </q-card-section>

            <q-card-actions class="q-px-lg q-pb-lg q-pt-none">
              <q-btn type="submit" color="primary" label="Crear cuenta" icon="check" :loading="cargando"
                class="full-width" size="md" no-caps />
            </q-card-actions>
          </q-form>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat class="info-card full-height">
          <q-card-section class="q-pa-lg">
            <div class="info-badge"><q-icon name="shield" size="26px" /></div>
            <div class="info-title q-mt-lg">Acceso seguro y controlado</div>
            <div class="info-text q-mt-sm">
              Las cuentas se crean únicamente desde el panel administrativo.
              Ideal para mantener el control de quién ingresa al sistema.
            </div>

            <div class="info-list q-mt-lg">
              <div class="info-item">
                <q-icon name="check_circle" size="18px" />
                <span>Cuentas creadas por un administrador</span>
              </div>
              <div class="info-item">
                <q-icon name="check_circle" size="18px" />
                <span>Acceso mediante credenciales institucionales</span>
              </div>
              <div class="info-item">
                <q-icon name="check_circle" size="18px" />
                <span>Contraseña temporal para el primer ingreso</span>
              </div>
            </div>

            <div class="info-note q-mt-lg">
              <q-icon name="lightbulb" size="18px" />
              Comparte la contraseña temporal por un canal seguro y pide cambiarla
              después del primer inicio de sesión.
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-badge {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 14px 26px -14px rgba(79, 70, 229, 0.9);
  flex: none;
}

.info-card {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  color: #fff;
  background: linear-gradient(150deg, #131f3f 0%, #312e81 55%, #4338ca 100%);
  box-shadow: 0 26px 50px -30px rgba(49, 46, 129, 0.9);
}

.info-card::after {
  content: "";
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  top: -140px;
  right: -80px;
  background: rgba(255, 255, 255, 0.08);
  pointer-events: none;
}

.info-card .q-card__section {
  position: relative;
  z-index: 1;
}

.info-badge {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #fff;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.info-title {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.info-text {
  font-size: 13.5px;
  line-height: 1.65;
  color: #c7d2fe;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #e0e7ff;
}

.info-item .q-icon {
  color: #67e8f9;
}

.info-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 14px;
  font-size: 12.5px;
  line-height: 1.55;
  color: #dbeafe;
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.info-note .q-icon {
  color: #fbbf24;
  flex: none;
  margin-top: 1px;
}
</style>
