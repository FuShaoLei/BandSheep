<script setup>
const props = defineProps({
  chart: { type: Object, required: true },
})
</script>

<template>
  <el-card shadow="never" class="metadata-card">
    <el-form label-position="top">
      <el-form-item label="歌名">
        <el-input v-model="chart.songName" placeholder="Song Name" size="large" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="调号">
            <el-input v-model="chart.key" placeholder="C" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="BPM">
            <el-input-number v-model="chart.tempo" :min="0" :max="300" placeholder="120" controls-position="right" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<style scoped>
.metadata-card {
  margin-bottom: 20px;
}

.metadata-card :deep(.el-card__body) {
  padding: 16px 20px;
}
</style>
