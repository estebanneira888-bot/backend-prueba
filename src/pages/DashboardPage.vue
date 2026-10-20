<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { cursosService } from "../services/cursos.service";
import { aprendicesService } from "../services/aprendices.service";
import { mensajeError } from "../services/api";
import { useAuthStore } from "../stores/auth";

const $q = useQuasar();
const router = useRouter();
const auth = useAuthStore();
const cargando = ref(false);
const totalCursos = ref(0);
const totalAprendices = ref(0);
const activos = ref(0);

const nombre = computed(() => auth.usuario?.nombre?.split(/\s+/)[0] || "bienvenido");
const fechaBase = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());
const fecha = fechaBase.charAt(0).toUpperCase() + fechaBase.slice(1);

const porcentajeActivos = computed(() =>
  totalAprendices.value ? Math.round((activos.value / totalAprendices.value) * 100) : 0
);

const cargar = async () => {
  cargando.value = true;
  try {
    const [cursos, aprendices] = await Promise.all([
      cursosService.listar(),
      aprendicesService.listar(),
    ]);
    totalCursos.value = cursos.data.length;
    totalAprendices.value = aprendices.data.length;
    activos.value = aprendices.data.filter((a) => a.status === 0).length;
  } catch (e) {
    $q.notify({ type: "negative", message: mensajeError(e) });
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);
</script>

<template>
  <div>
    <q-card flat class="hero-card q-mb-lg">
      <q-card-section class="row items-center q-py-xl q-px-xl">
        <div class="col-12 col-md-8">
          <div class="hero-eyebrow">Resumen general</div>
          <div class="hero-title">Hola, {{ nombre }}</div>
          <div class="hero-sub">{{ fecha }}</div>

          <div class="row q-gutter-sm q-mt-lg hero-actions">
            <q-btn unelevated no-caps icon="add" label="Nuevo curso" class="hero-btn"
              @click="router.push({ name: 'cursos' })" />
            <q-btn outline no-caps icon="person_add" label="Matricular aprendiz" class="hero-btn-outline"
              @click="router.push({ name: 'aprendices' })" />
          </div>
        </div>
        <div class="col-4 flex flex-center gt-sm">
          <div class="hero-art"><q-icon name="auto_stories" size="56px" /></div>
        </div>
      </q-card-section>
      <q-inner-loading :showing="cargando">
        <q-spinner-dots color="white" size="42px" />
      </q-inner-loading>
    </q-card>

    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-sm-4">
        <q-card flat class="stat-card stat-indigo cursor-pointer" @click="router.push({ name: 'cursos' })">
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between">
              <div class="stat-icon"><q-icon name="menu_book" size="24px" /></div>
              <q-btn flat round dense icon="arrow_outward" class="stat-link" />
            </div>
            <div class="stat-value q-mt-lg">{{ totalCursos }}</div>
            <div class="stat-label">Cursos registrados</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat class="stat-card stat-teal cursor-pointer" @click="router.push({ name: 'aprendices' })">
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between">
              <div class="stat-icon"><q-icon name="groups" size="24px" /></div>
              <q-btn flat round dense icon="arrow_outward" class="stat-link" />
            </div>
            <div class="stat-value q-mt-lg">{{ totalAprendices }}</div>
            <div class="stat-label">Aprendices registrados</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat class="stat-card stat-amber cursor-pointer" @click="router.push({ name: 'usuarios' })">
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between">
              <div class="stat-icon"><q-icon name="verified_user" size="24px" /></div>
              <q-btn flat round dense icon="arrow_outward" class="stat-link" />
            </div>
            <div class="stat-value q-mt-lg">{{ activos }}</div>
            <div class="stat-label">Aprendices activos</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-7">
        <q-card flat class="card-soft full-height">
          <q-card-section class="q-pa-lg">
            <div class="row items-center">
              <div class="col">
                <div class="section-title">Actividad académica</div>
                <div class="section-sub">Porcentaje de aprendices en formación</div>
              </div>
              <q-chip color="primary" text-color="white" icon="insights" class="q-ma-none">
                {{ porcentajeActivos }}%
              </q-chip>
            </div>

            <q-linear-progress :value="porcentajeActivos / 100" size="12px" rounded color="primary"
              track-color="blue-1" class="q-mt-lg" />

            <div class="row q-mt-md text-caption text-grey-6">
              <div class="col">{{ activos }} activos</div>
              <div class="col text-right">{{ totalAprendices - activos }} retirados</div>
            </div>

            <q-separator class="q-my-lg" />

            <div class="row q-col-gutter-md text-center">
              <div class="col-6">
                <div class="mini-stat">
                  <q-icon name="menu_book" size="20px" color="primary" />
                  <div>
                    <div class="mini-value">{{ totalCursos }}</div>
                    <div class="mini-label">Programas</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="mini-stat">
                  <q-icon name="school" size="20px" color="secondary" />
                  <div>
                    <div class="mini-value">{{ totalAprendices }}</div>
                    <div class="mini-label">Aprendices</div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-5">
        <q-card flat class="card-soft full-height">
          <q-card-section class="q-pa-lg">
            <div class="section-title">Accesos rápidos</div>
            <div class="section-sub q-mb-md">Gestiona los módulos del sistema</div>

            <div class="quick-list">
              <div class="quick-item" @click="router.push({ name: 'cursos' })">
                <div class="quick-icon quick-indigo"><q-icon name="menu_book" size="20px" /></div>
                <div class="col">
                  <div class="quick-title">Cursos</div>
                  <div class="quick-sub">Oferta académica</div>
                </div>
                <q-icon name="chevron_right" color="grey-5" />
              </div>

              <div class="quick-item" @click="router.push({ name: 'aprendices' })">
                <div class="quick-icon quick-teal"><q-icon name="groups" size="20px" /></div>
                <div class="col">
                  <div class="quick-title">Aprendices</div>
                  <div class="quick-sub">Fichas y matrículas</div>
                </div>
                <q-icon name="chevron_right" color="grey-5" />
              </div>

              <div class="quick-item" @click="router.push({ name: 'usuarios' })">
                <div class="quick-icon quick-amber"><q-icon name="manage_accounts" size="20px" /></div>
                <div class="col">
                  <div class="quick-title">Usuarios</div>
                  <div class="quick-sub">Crear cuentas internas</div>
                </div>
                <q-icon name="chevron_right" color="grey-5" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.05);
  text-align: left;
}

.mini-value {
  font-weight: 800;
  font-size: 16px;
  line-height: 1.1;
  color: #0f172a;
}

.mini-label {
  font-size: 11.5px;
  color: #64748b;
}

.quick-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.quick-item:hover {
  background: #f8faff;
  transform: translateX(3px);
  box-shadow: 0 12px 24px -18px rgba(15, 23, 42, 0.5);
}

.quick-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: #fff;
  flex: none;
}

.quick-indigo {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
}

.quick-teal {
  background: linear-gradient(135deg, #0284c7, #06b6d4);
}

.quick-amber {
  background: linear-gradient(135deg, #f59e0b, #f97316);
}

.quick-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.quick-sub {
  font-size: 11.5px;
  color: #64748b;
}
</style>
