<template>
  <div>
    <img style="padding: 3px 10px 0 0; float:right; z-index: 9" src="../img/xRed.svg" @click="startModal" :class="addClass">
    <b-modal ref="myModalRef" hide-footer title="Using Component Methods">
      <div class="d-block text-center">
        <h3>Hello From My Modal!</h3>
      </div>
      <b-btn class="mt-3" variant="outline-danger" block @click="hideModal">Close Me</b-btn>
    </b-modal>
  </div>
</template>

<script>
    export default {
        props: [
            'addClass',
            'type',
            'index',
            'action'
        ],
        methods: {
            startModal: function(){
                var deleteModal = document.getElementById('modal');

                const deleteModalInstance = new Modal(deleteModal,
                    {content: `
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Delete ${this.type}?</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span >&times;</span>
            </button>
          </div>
          <div class="modal-body">Are you sure you want to delete this ${this.type}</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button id="bAccept" type="button" class="btn btn-primary">Yes</button>
          </div>`,
                        backdrop: true,
                        keyboard: true
                    });

                //Wouldn't peoperly run both of these callbacks in the same listener.
                document.getElementById('bAccept').addEventListener('click', deleteModalInstance.hide);
                document.getElementById('bAccept').addEventListener('click', this.action(this.index));

                deleteModalInstance.show();
            }
        }
    }
</script>

<style>

</style>