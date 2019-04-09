<template>
  <div id="blockly">
    <div id="blocklyDiv" :style="'height: ' + height + '; width: ' + width + ';'"></div>
    <xml id="toolbox" style="display: none">
    </xml>
  </div>
</template>

<script>

export default {
  name: 'Blockly',
  props: ['height', 'width'],
  data() {
    return {
      toolbox: [
        {
          name: 'Logic',
          colour: '%{BKY_LOGIC_HUE}',
          items: [
            'controls_if', 'logic_compare', 'logic_operation',
            'logic_negate', 'logic_boolean', 'logic_null',
          ],
        },
        {
          name: 'Math',
          colour: '%{BKY_MATH_HUE}',
          items: [
            'math_number', 'math_arithmetic', 'math_single',
            'math_round', 'math_trig', 'math_constant',
            'math_number_property', 'math_modulo',
            'math_random_int', 'math_random_float',
          ],
        },
        {
          name: 'Loops',
          colour: '%{BKY_LOOPS_HUE}',
          items: [
            'controls_repeat_ext', 'controls_repeat', 'controls_for',
            'controls_whileUntil', 'controls_flow_statements',
          ],
        },
        {
          name: 'Text',
          colour: '%{BKY_TEXTS_HUE}',
          items: [
            'text', 'text_join', 'text_length', 'text_isEmpty',
            'text_indexOf', 'text_charAt', 'text_getSubstring',
            'text_changeCase',
          ],
        },
        {
          name: 'Var',
          colour: '%{BKY_VARIABLES_HUE}',
          items: [
            'variables_get', 'variables_set', 'math_change',
          ],
        },
        {
          name: 'List',
          colour: '%{BKY_LISTS_HUE}',
          items: [
            'lists_create_empty', 'lists_create_with', 'lists_repeat',
            'lists_length', 'lists_isEmpty', 'lists_indexOf',
            'lists_getIndex', 'lists_setIndex',
          ],
        },
        {
          name: 'BaseList',
          colour: '%{BKY_BASELIST_HUE}',
          items: [
            'baselist_set_position', 'baselist_get', 'baselist_set', 'baselist_create_from',
            'basenode_get', 'basenode_set', 'baselist_get_now_node',
            'baselist_remove_node_onview', 'baselist_remove_node_real',
            'baselist_move_to_next', 'baselist_now_point_to_other',
            'baselist_new_point_to_other', 'baselist_add_new_node_true',
            'baselist_get_new_node', 'baselist_create_new_node',
            'baselist_get_node_number', 'baselist_get_nownode_value',
            'baselist_nownode_is_last', 'basenode_get_value', 'baselist_get_next_node',
          ],
        },
      ],
      demoWorkspace: null,
    };
  },
  mounted() {
    window.onload = this.getToolBox();
    this.demoWorkspace = this.Blockly.inject('blocklyDiv',
        {
          media: '/static/blockly/media/',
          toolbox: document.getElementById('toolbox')
        });
  },
  methods: {
    getToolBox() {
      let c;
      let i;
      const xml = document.getElementById('toolbox');
      xml.style.display = 'none';
      this.toolbox.forEach((category) => {
        c = document.createElement('category');
        c.setAttribute('name', category.name);
        c.setAttribute('colour', category.colour);
        category.items.forEach((item) => {
          i = document.createElement('block');
          i.setAttribute('type', item);
          c.appendChild(i);
        });
        xml.appendChild(c);
      });
    },
    xmlToBlocks: function(xml) {
      const dom = this.Blockly.Xml.textToDom(xml);
      this.Blockly.Xml.domToWorkspace(dom, this.demoWorkspace);
    },
    blocksToXml: function() {
      const dom = this.Blockly.Xml.workspaceToDom(this.demoWorkspace);
      return this.Blockly.Xml.domToText(dom);
    },
    blocksToJson: function() {
      return JSON.stringify(this.Blockly.JavaScript.workspaceToCode(this.demoWorkspace));
    },
  },
}
</script>

<style scoped>
</style>
