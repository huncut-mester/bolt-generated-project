<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from './Button.vue';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  format?: (value: any) => string;
}

interface Props {
  columns: Column[];
  data: any[];
  loading?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selectable: false,
  pagination: true,
  itemsPerPage: 10
});

const currentPage = ref(1);
const sortBy = ref('');
const sortDesc = ref(false);
const selected = ref<Set<any>>(new Set());

const totalPages = computed(() => 
  Math.ceil(props.data.length / props.itemsPerPage)
);

const paginatedData = computed(() => {
  let result = [...props.data];
  
  if (sortBy.value) {
    result.sort((a, b) => {
      const modifier = sortDesc.value ? -1 : 1;
      return modifier * String(a[sortBy.value])
        .localeCompare(String(b[sortBy.value]));
    });
  }
  
  if (props.pagination) {
    const start = (currentPage.value - 1) * props.itemsPerPage;
    result = result.slice(start, start + props.itemsPerPage);
  }
  
  return result;
});

function toggleSort(column: Column) {
  if (!column.sortable) return;
  
  if (sortBy.value === column.key) {
    sortDesc.value = !sortDesc.value;
  } else {
    sortBy.value = column.key;
    sortDesc.value = false;
  }
}

function toggleSelectAll() {
  if (selected.value.size === paginatedData.value.length) {
    selected.value.clear();
  } else {
    selected.value = new Set(paginatedData.value.map(item => item.id));
  }
}

function toggleSelect(id: any) {
  if (selected.value.has(id)) {
    selected.value.delete(id);
  } else {
    selected.value.add(id);
  }
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-if="selectable"
            scope="col"
            class="w-12 px-6 py-3 text-left"
          >
            <input
              type="checkbox"
              class="rounded border-gray-300 text-primary focus:ring-primary"
              :checked="selected.size === paginatedData.length"
              :indeterminate="selected.size > 0 && selected.size < paginatedData.length"
              @change="toggleSelectAll"
            />
          </th>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            :class="{ 'cursor-pointer hover:text-gray-700': column.sortable }"
            @click="toggleSort(column)"
          >
            <div class="flex items-center space-x-1">
              <span>{{ column.label }}</span>
              <template v-if="column.sortable">
                <ChevronUpIcon
                  v-if="sortBy === column.key && !sortDesc"
                  class="h-4 w-4"
                />
                <ChevronDownIcon
                  v-else-if="sortBy === column.key && sortDesc"
                  class="h-4 w-4"
                />
                <ChevronUpDownIcon
                  v-else
                  class="h-4 w-4 text-gray-400"
                />
              </template>
            </div>
          </th>
        </tr>
      </thead>
      
      <tbody class="bg-white divide-y divide-gray-200">
        <template v-if="loading">
          <tr v-for="i in itemsPerPage" :key="i">
            <td
              :colspan="selectable ? columns.length + 1 : columns.length"
              class="px-6 py-4"
            >
              <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
          </tr>
        </template>
        
        <template v-else>
          <tr
            v-for="item in paginatedData"
            :key="item.id"
            class="hover:bg-gray-50"
          >
            <td
              v-if="selectable"
              class="w-12 px-6 py-4"
            >
              <input
                type="checkbox"
                class="rounded border-gray-300 text-primary focus:ring-primary"
                :checked="selected.has(item.id)"
                @change="toggleSelect(item.id)"
              />
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              {{ column.format ? column.format(item[column.key]) : item[column.key] }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div
      v-if="pagination && totalPages > 1"
      class="flex items-center justify-between px-6 py-3 border-t border-gray-200"
    >
      <div class="flex-1 flex justify-between sm:hidden">
        <Button
          variant="secondary"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </Button>
      </div>
      
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">
              {{ ((currentPage - 1) * itemsPerPage) + 1 }}
            </span>
            to
            <span class="font-medium">
              {{ Math.min(currentPage * itemsPerPage, props.data.length) }}
            </span>
            of
            <span class="font-medium">{{ props.data.length }}</span>
            results
          </p>
        </div>
        
        <div>
          <nav
            class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <Button
              variant="ghost"
              :disabled="currentPage === 1"
              @click="currentPage = 1"
            >
              <ChevronDoubleLeftIcon class="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <ChevronLeftIcon class="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <ChevronRightIcon class="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              :disabled="currentPage === totalPages"
              @click="currentPage = totalPages"
            >
              <ChevronDoubleRightIcon class="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
