<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { aprendicesService } from "../services/aprendices.service";
import { cursosService } from "../services/cursos.service";
import { mensajeError } from "../services/api";

const $q = useQuasar();
const aprendices = ref([]);
const cursos = ref([]);
const filtroCurso = ref(null);
const cargando = ref(false);
const dialogo = ref(false);
const editandoId = ref(null);
const form = ref({ documento: "", nombre: "", email: "", curso: null });

const opcionesCurso = computed(() =>
  cursos.value.filter((c) => c.status === 0).map((c) => ({ label: `${c.codigo} - ${c.nombre}`, value: c._id }))
);

const columnas = [
  { name: "documento", label: "Documento", field: "documento", align: "left", sortable: true },
  { name: "nombre", label: "Nombre", field: "nombre", align: "left", sortable: true },
  {
    name: "curso",
    label: "Curso",
    field: (r) =>
      typeof r.curso === "string"
        ? cursos.value.find((c) => c._id === r.curso)?.nombre || "Sin curso"
        : r.curso?.nombre || "Sin curso",
    align: "left",
    sortable: true,
  },
  { name: "status", label: "Estado", field: "status", align: "center" },
  { name: "acciones", label: "", align: "right" },
];

const cargar = async () => {
  cargando.value = true;
  try {
    const { data } = filtroCurso.value
      ? await aprendicesService.porCurso(filtroCurso.value)
      : await aprendicesService.listar();
    aprendices.value = data;
  } catch (e) {
    $q.notify({ type: "negative", message: mensajeError(e) });
  } finally {
    cargando.value = false;
  }
};

const abrir = (a) => {
  editandoId.value = a?._id || null;
  form.value = a
    ? {
        documento: a.documento,
        nombre: a.nombre,
        email: a.email,
        curso: typeof a.curso === "string" ? a.curso : a.curso?._id || null,
      }
    : { documento: "", nombre: "", email: "", curso: null };
  dialogo.value = true;
};

const guardando = ref(false);

const guardar = async () => {
  if (guardando.value) return;
  guardando.value = true;
  try {
    const { data } = editandoId.value
      ? await aprendicesService.actualizar(editandoId.value, form.value)
      : await aprendicesService.crear(form.value);
    $q.notify({ type: "positive", message: data.msg });
    dialogo.value = false;
    await cargar();
  } catch (e) {
    $q.notify({ type: "negative", message: mensajeError(e) });
  } finally {
    guardando.value = false;
  }
};

const cambiarEstado = async (a) => {
  try {
    const { data } = a.status === 0 ? await aprendicesService.desactivar(a._id) : await aprendicesService.activar(a._id);
    $q.notify({ type: "positive", message: data.msg });
    await cargar();
  } catch (e) {
    $q.notify({ type: "negative", message: mensajeError(e) });
  }
};

onMounted(async () => {
  try {
    cursos.value = (await cursosService.listar()).data;
  } catch (e) {
    $q.notify({ type: "negative", message: mensajeError(e) });
  }
  cargar();
});
</script>

<template>
  <div>
    <div class="page-header q-mb-lg">
      <div class="page-header-icon teal"><q-icon name="groups" size="26px" /></div>
      <div class="col">
        <div class="section-title">Aprendices</div>
        <div class="section-sub">Ficha de cada estudiante y su programa</div>
      </div>
      <q-chip class="gt-sm q-ma-none" color="cyan-1" text-color="cyan-9" icon="groups">
        {{ aprendices.length }} {{ aprendices.length === 1 ? "aprendiz" : "aprendices" }}
      </q-chip>
      <q-select v-model="filtroCurso" :options="opcionesCurso" emit-value map-options clearable dense outlined
        label="Programa académico" class="filter-select" @update:model-value="cargar">
        <template #prepend><q-icon name="filter_list" /></template>
      </q-select>
      <q-btn color="accent" icon="person_add" label="Matricular" no-caps @click="abrir()" />
    </div>

    <q-table :rows="aprendices" :columns="columnas" row-key="_id" :loading="cargando" class="app-table"
      :rows-per-page-options="[8, 16, 24]" separator="horizontal"
      no-data-label="No hay aprendices para este filtro." rows-per-page-label="Filas por página">
      <template #body-cell-nombre="{ row }">
        <q-td>
          <div class="row items-center no-wrap q-gutter-sm">
            <div class="row-avatar">{{ row.nombre?.charAt(0)?.toUpperCase() || "?" }}</div>
            <div>
              <div class="text-weight-bold text-grey-9">{{ row.nombre }}</div>
              <div class="text-caption text-grey-6">{{ row.email }}</div>
            </div>
          </div>
        </q-td>
      </template>
      <template #body-cell-status="{ row }">
        <q-td class="text-center">
          <q-chip :color="row.status === 0 ? 'positive' : 'grey-5'" text-color="white" dense
            :icon="row.status === 0 ? 'verified' : 'highlight_off'">
            {{ row.status === 0 ? "En formación" : "Retirado" }}
          </q-chip>
        </q-td>
      </template>
      <template #body-cell-acciones="{ row }">
        <q-td class="text-right">
          <q-btn outline dense icon="edit_note" color="secondary" label="Ficha" class="q-mr-sm" no-caps @click="abrir(row)" />
          <q-btn dense :icon="row.status === 0 ? 'person_off' : 'person_add_alt'"
            :color="row.status === 0 ? 'negative' : 'positive'"
            :label="row.status === 0 ? 'Retirar' : 'Reintegrar'" no-caps @click="cambiarEstado(row)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogo" position="right" full-height transition-show="slide-left" transition-hide="slide-right">
      <q-card style="width: 470px; max-width: 94vw">
        <q-card-section class="dialog-head teal">
          <div class="text-h6 text-weight-bold">
            <q-icon name="school" class="q-mr-sm" />{{ editandoId ? "Actualizar ficha" : "Matricular aprendiz" }}
          </div>
          <div class="text-caption q-mt-xs">Verifica documento y correo antes de guardar.</div>
        </q-card-section>
        <q-form @submit.prevent="guardar">
          <q-card-section class="q-gutter-md q-pt-lg">
            <q-input v-model="form.documento" label="Documento de identidad" outlined :rules="[(v) => !!v?.trim() || 'El documento es obligatorio']">
              <template #prepend><q-icon name="id_card" /></template>
            </q-input>
            <q-input v-model="form.nombre" label="Nombres y apellidos" outlined :rules="[(v) => !!v?.trim() || 'El nombre es obligatorio']">
              <template #prepend><q-icon name="person" /></template>
            </q-input>
            <q-input v-model="form.email" type="email" label="Correo del aprendiz" outlined :rules="[(v) => !!v?.trim() || 'El correo es obligatorio']">
              <template #prepend><q-icon name="mail" /></template>
            </q-input>
            <q-select v-model="form.curso" :options="opcionesCurso" emit-value map-options label="Programa académico" outlined
              :rules="[(v) => !!v || 'Selecciona un curso']">
              <template #prepend><q-icon name="menu_book" /></template>
            </q-select>
          </q-card-section>
          <q-card-actions align="right" class="q-pa-lg">
            <q-btn flat label="Cerrar" color="grey-7" v-close-popup no-caps />
            <q-btn type="submit" color="accent" label="Guardar ficha" icon="save" :loading="guardando" no-caps />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.filter-select {
  min-width: 240px;
}

.row-avatar {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 800;
  color: #0e7490;
  background: linear-gradient(135deg, #e0f2fe, #cffafe);
  flex: none;
}
</style>
