<template>
	<el-card id="show-data">
		<div slot="header" style="height: 20px;">
			<span>{{ name }}</span>
		</div>
		<el-table
			:data="showdata"
			:max-height="height"
		>
			<el-table-column
				fixed
				prop="key"
				label="变量名"
				width="75">
			</el-table-column>
			<el-table-column
				prop="value"
				label="变量值">
			</el-table-column>
		</el-table>
	</el-card>
</template>

<script>
export default {
  name: 'ShowData',
  props: {
    name: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      default: 200,
    },
    showdata: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    topStyle: () => {
      return 'top: ' + top;
    },
  },
  data() {
    return {};
  },
  methods: {},
}
</script>

<style scoped>
	#show-data {
		width: 300px;
		position: absolute !important;
		right: 0;
	}
</style>
