<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { cursosService } from "../services/cursos.service";
import { mensajeError } from "../services/api";

const $q = useQuasar();
const cursos = ref([]);
const cargando = ref(false);
const dialogo = ref(false);
const editandoId = ref(null);
const guardando = ref(false);
const form = ref({ codigo: "", nombre: "", duracion: null });

const columnas = [
  { name: "codigo", label: "Código", field: "codigo", align: "left", sortable: true },
  { name: "nombre", label: "Nombre", field: "nombre", align: "left", sortable: true },
  { name: "duracion", label: "Duración (h)", field: "duracion", align: "right", sortable: true },
  { name: "status", label: "Estado", field: "status", align: "center" },
  { name: "acciones", label: "", align: "right" },
];

const cargar = async () => {
  cargando.value = true;
  try {
    cursos.value = (await cursosService.listar()).data;
  } catch (e) {
    $q.notify({ type: "negative", message: mensajeError(e) });
  } finally {
    cargando.value = false;
  }
};

const abrir = (c) => {
  editandoId.value = c?._id || null;
  form.value = c
    ? { codigo: c.codigo, nombre: c.nombre, duracion: c.duracion }
    : { codigo: "", nombre: "", duracion: null };
  dialogo.value = true;
};

const guardar = async () => {
  if (guardando.value) return;
  guardando.value = true;
  try {
    const payload = { ...form.value, duracion: Number(form.value.duracion) };
    const { data } = editandoId.value
      ? await cursosService.actualizar(editandoId.value, payload)
      : await cursosService.crear(payload);
    $q.notify({ type: "positive", message: data.msg });
    dialogo.value = false;
    await cargar();
  } catch (e) {
    $q.notify({ type: "negative", message: mensajeError(e) });
  } finally {
    guardando.value = false;
  }
};

const cambiarEstado = async (c) => {
  try {
    const { data } = c.status === 0 ? await cursosService.desactivar(c._id) : await cursosService.activar(c._id);
    $q.notify({ type: "positive", message: data.msg });
    await cargar();
  } catch (e) {
    $q.notify({ type: "negative", message: mensajeError(e) });
  }
};

onMounted(cargar);
</script>

<template>
  <div>
    <div class="page-header q-mb-lg">
      <div class="page-header-icon indigo"><q-icon name="menu_book" size="26px" /></div>
      <div class="col">
        <div class="section-title">Cursos</div>
        <div class="section-sub">Oferta académica disponible</div>
      </div>
      <q-chip class="gt-xs q-ma-none" color="indigo-1" text-color="primary" icon="inventory_2">
        {{ cursos.length }} {{ cursos.length === 1 ? "curso" : "cursos" }}
      </q-chip>
      <q-btn flat round dense icon="refresh" color="grey-7" @click="cargar">
        <q-tooltip>Recargar</q-tooltip>
      </q-btn>
      <q-btn color="accent" icon="add_circle" label="Agregar curso" no-caps @click="abrir()" />
    </div>

    <q-table :rows="cursos" :columns="columnas" row-key="_id" :loading="cargando" class="app-table"
      :rows-per-page-options="[8, 16, 24]" separator="horizontal"
      no-data-label="Aún no hay cursos. Agrega el primero." rows-per-page-label="Filas por página">
      <template #body-cell-codigo="{ row }">
        <q-td>
          <span class="code-pill">{{ row.codigo }}</span>
        </q-td>
      </template>
      <template #body-cell-nombre="{ row }">
        <q-td>
          <div class="text-weight-bold text-grey-9">{{ row.nombre }}</div>
        </q-td>
      </template>
      <template #body-cell-status="{ row }">
        <q-td class="text-center">
          <q-chip :color="row.status === 0 ? 'positive' : 'grey-5'" text-color="white" dense
            :icon="row.status === 0 ? 'check_circle' : 'pause_circle'">
            {{ row.status === 0 ? "Activo" : "Inactivo" }}
          </q-chip>
        </q-td>
      </template>
      <template #body-cell-acciones="{ row }">
        <q-td class="text-right">
          <q-btn outline dense icon="edit" color="secondary" label="Editar" class="q-mr-sm" no-caps @click="abrir(row)" />
          <q-btn dense :icon="row.status === 0 ? 'block' : 'play_arrow'" :color="row.status === 0 ? 'negative' : 'positive'"
            :label="row.status === 0 ? 'Suspender' : 'Habilitar'" no-caps @click="cambiarEstado(row)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogo" position="right" full-height transition-show="slide-left" transition-hide="slide-right">
      <q-card style="width: 450px; max-width: 94vw">
        <q-card-section class="dialog-head indigo">
          <div class="text-h6 text-weight-bold">
            <q-icon name="menu_book" class="q-mr-sm" />{{ editandoId ? "Actualizar curso" : "Agregar curso" }}
          </div>
          <div class="text-caption q-mt-xs">
            Completa la información del programa académico.
          </div>
        </q-card-section>
        <q-form @submit.prevent="guardar">
          <q-card-section class="q-gutter-md q-pt-lg">
            <q-input v-model="form.codigo" label="Código del programa" outlined hint="Ej. ADSO-01" :rules="[(v) => !!v?.trim() || 'El código es obligatorio']">
              <template #prepend><q-icon name="tag" /></template>
            </q-input>
            <q-input v-model="form.nombre" label="Nombre del programa" outlined :rules="[(v) => !!v?.trim() || 'El nombre es obligatorio']">
              <template #prepend><q-icon name="title" /></template>
            </q-input>
            <q-input v-model="form.duracion" type="number" label="Intensidad (horas)" outlined
              :rules="[(v) => (!!v && Number(v) > 0) || 'La duración debe ser mayor a 0']">
              <template #prepend><q-icon name="schedule" /></template>
            </q-input>
          </q-card-section>
          <q-card-actions align="right" class="q-pa-lg">
            <q-btn flat label="Cerrar" color="grey-7" v-close-popup no-caps />
            <q-btn type="submit" color="accent" label="Guardar" icon="save" :loading="guardando" no-caps />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.code-pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  background: #eef2ff;
  color: #4338ca;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.02em;
}
</style>
