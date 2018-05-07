<template>
  <div class="row align-items-center">
    <label class="switch col-1">
      <input type="checkbox" @change="check" :value="rule">
      <span class="slider round"></span>
    </label>
    <div class="col-9">
      <span v-if="!edit" @click="edit = !edit;" style="color: white"><span style="padding-right: 15px; color: white; font-weight: bolder;">{{rule.pts | positive}}</span> {{rule.desc}}</span>
      <span v-else><input style="width: 50px; height: 100%;" class="textInput" type="number" v-model="locPts"><input style="width: 75%; height: 100%;" type="text" class="textInput" v-model="locDesc"></span>
    </div>
    <div class="col">
      <img src="../img/delete_can_white.png" class="clickable float-right removeButton deleteImg" @click="remove" title="Remove">
      <img v-if="!edit" src="../img/edit_pencil_white.png" class="clickable float-right deleteImg" @click="editvalues" title="Edit">
      <img v-else class="clickable float-right deleteImg" @click="savevalues" src="../img/save_white.png">
    </div>
  </div>
</template>

<script>
  export default {
    props: ['rule', 'index'],data: function() {
      return {
        id: this._uid,
        edit: false,
        locDesc: this.rule.desc,
        locPts: this.rule.pts,
        checked: false,
        //shownUndoTip: false
      }
    },
    filters: {
      positive: function(num) {
        if (num > 0) return `+${num}`;
        return num;
      }
    },
    methods: {
      remove: function() {
        this.$emit('ruleunchecked', {
          rule: this.rule,
          id: this.id
        });
        this.$emit('deleterule', {
          index: this.index
        });
        // if (!this.shownUndoTip) {
        //   $('.collapse').collapse();
        //   this.shownUndoTip = true;
        //   setTimeout(
        //     function() {
        //       $('.collapse').collapse('hide');
        //     }, 3000);
        // }
      },
      editvalues: function() {
        this.edit = !this.edit;
      },
      savevalues: function(event) {
        this.edit = !this.edit;
        let oldDesc = this.rule.desc;
        this.$emit('rulechanged', {
          desc: this.locDesc,
          pts: this.locPts,
          index: this.index
        });
        if (oldDesc != this.rule.desc) {
          this.$emit('ruleunchecked', {
            rule: this.rule,
            id: this.id
          });
        }
        if (this.checked && oldDesc == this.rule.desc) {
          this.$emit('ruleunchecked', {
            rule: this.rule,
            id: this.id
          });
          this.$emit('rulechecked', {
            rule: this.rule,
            id: this.id
          });
        }
      },
      check: function(event) {
        if (event.target.checked) {
          this.$emit('rulechecked', {
            rule: this.rule,
            id: this.id
          });
          this.checked = true;
        } else {
          this.$emit('ruleunchecked', {
            rule: this.rule,
            id: this.id
          });
          this.checked = false;
        }
      }
    }
  }
</script>

<style>

</style>
