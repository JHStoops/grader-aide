<template>
  <div class="container-fluid" id="app">
    <div class="row">
      <!-- title row -->
      <div class="col-xs-12 col-sm-3 assignmentListContainer" style="min-width: 220px;">
        <h4 class="assignmentHdr">
          Courses
          <img src="../img/plusGreen.svg" class="clickable" title="Add Course" @click="createCourse()"
               style="float:right; padding: 10px 25px 0 0;">
        </h4>

        <!-- List Courses -->
        <div class="list-group courseList">
          <span v-for="(course, i) in courses" @click="switchAssignment(i, 0)">
            <span class="list-group-item clickable" style="color: black;">
              <input v-if="course.editing" v-model="course.name" type="text" @click="$event.stopPropagation()" @keyup.enter="editCourse(course)">
              <span v-else>{{course.name}} </span>
              <img src="../img/delete_can.png" class="deleteImg clickable" @click="$event.stopPropagation(); deleteCourseIndex = i; $refs.courseDeletionModal.show()">
              <img v-if="course.editing" src="../img/save_black.png" class="clickable deleteImg" @click="$event.stopPropagation(); editCourse(course)">
              <img v-else src="../img/edit_pencil_black.png" class="clickable deleteImg" @click="toggleCourseEdit($event, i);">
            </span>

            <!-- List Assignments within the course -->
            <span v-if="i === currentCourseIndex" v-for="(assignment, j) of course.assignments" @click="$event.stopPropagation(); switchAssignment(i, j);"
                  class="list-group-item list-group-item-action clickable assignmentListItem" style="color: black; padding: 0 0 0 50px;">
              <span @click="setActiveClass($event, 'assignmentListItem', 'list-group-item-secondary')">{{assignment.name}}</span>
              <img @click="$event.stopPropagation(); deleteAssnIndex = j; $refs.assnDeletionModal.show()" src="../img/delete_can.png"
                   style="margin: 0 20px 0 0;" class="deleteImg clickable">
            </span>
          </span>
        </div>

        <!-- Delete Assignment Modal -->
        <b-modal ref="assnDeletionModal" hide-footer title="Delete Assignment" style="color: black">
          <div class="d-block">
            <p>Are you sure you want to delete {{ assnToDelete }}?</p>
          </div>
          <b-btn inline-block @click="removeAssignment">Yes</b-btn>
          <b-btn inline-block @click="deleteAssnIndex = null; $refs.assnDeletionModal.hide()">Cancel</b-btn>
        </b-modal>

        <!-- Delete Course Modal -->
        <b-modal ref="courseDeletionModal" hide-footer title="Delete Course" style="color: black">
          <div class="d-block">
            <p>Are you sure you want to delete {{ courseToDelete }}?</p>
          </div>
          <b-btn inline-block @click="removeCourse">Yes</b-btn>
          <b-btn inline-block @click="deleteCourseIndex = null; $refs.courseDeletionModal.hide()">Cancel</b-btn>
        </b-modal>
      </div>

      <div class="col-xs-12 col-sm-6 margMain">
        <div v-if="courses.length === 0">
          <p>There are no courses</p>
          <button @click="createCourse()" class="btn btn-primary">Create Course</button>
        </div>
        <div v-else-if="!hasAssignments">
          <p>This course has no assignments</p>
          <button @click="createAssignment()" class="btn btn-primary">Create Assignment</button>
        </div>
        <div v-else style="margin: auto; width: 75%;">
          <div class="container">
            <div class="row">
              <h2 v-if="!editName" class="assignmentName clickable" @click="editName = !editName; originalName = currentAssn.name">{{ currentAssn.name }}</h2>
              <input style="width: 50%" v-else class="editName textInput" type="text" v-model="currentAssn.name"
                     @keyup.enter="editName = !editName;">
              <span>
                <img class="clickable deleteImg" v-if="editName" style="padding-top: 11px; margin-left: 5px; width: 26px;"
                     @click="editName = !editName;" src="../img/save_white.png">
                <img v-else style="padding-top: 11px; margin-left: 5px; width: 26px;" src="../img/edit_pencil_white.png"
                     @click="editName = !editName; originalName = currentAssn.name" class="clickable deleteImg">
              </span>
            </div>
          </div>
          <hr class="line">
          <div class="container">
            <div class="row">
              <h4 v-if="!editTotalPts" @click="editTotalPts = !editTotalPts;">{{currentAssn.totalPts}}<span class="ptsPts clickable"> pts</span></h4>
              <input v-else style="width: 20%; height: 100%;" class="editTotalPts textInput" type="number" v-model.number="currentAssn.totalPts">
              <img v-if="editTotalPts" style="padding-top: 7px; margin-left: 5px; height: 100%; width: 25px;"
                   class="clickable deleteImg" @click="editTotalPts = !editTotalPts;" src="../img/save_white.png">
              <img v-else style="padding-top: 4px; margin-left: 5px; height: 100%;" src="../img/edit_pencil_white.png"
                   @click="editTotalPts = !editTotalPts;" class="clickable deleteImg">
            </div>
          </div>

          <div v-if="!plusFormActive" @click="plusFormActive=true">
            <img src="../img/plusGreen.svg" class="clickable" title="Open Add Fields"><span style="padding: 15px">Add Rules / Comments</span>
          </div>


          <!-- rules rows -->
          <div v-for="(rule, i) of commentsAtBottom(currentAssn.rules)" :key="rule.desc" class="container ruleRow">
            <rule v-model="selectedRules" :rule="rule" :index="i"
                  @rulechecked="checkrule" @ruleunchecked="uncheckrule" @deleterule="deleteRule" @rulechanged="ruleChanged"> </rule>
          </div>

          <!-- add row -->
          <div v-if="plusFormActive">
            <input class="addRuleNum col-xl-2" type="number" v-model.number.lazy="addNum" @keyup.enter="addRule()" title="pts (positive or negative)">
            <input class="addRuleDesc col-xl-9" type="text" v-model.trim.lazy="addDesc" @keyup.enter="addRule()" placeholder="Type your new rule here ...">
            <img src="../img/plusGreen.svg" class="clickable float-right" @click="addRule()" title="Add"><br>
          </div>

          <!-- output rows -->
          <div :class="[(actualPts < currentAssn.totalPts) ? 'alert-warning' : 'alert-success']" class="alert margMain" role="alert">
            <span v-show="selectedRules.length > 0" id="copyToClipboard" style="float:right" class="clickable" data-clipboard-target="#areaToBeCopied">📋</span>
            <span id="areaToBeCopied">
              <span v-for="selectedRule of commentsAtBottom(selectedRules)">{{selectedRule.pts | positive}} {{selectedRule.desc}}<br></span>
              <hr>
              {{actualPts}} / {{ currentAssn.totalPts }}
            </span>
          </div>
          <button @click="saveChanges()" class="btn btn-success">Save</button>
          <button @click="createAssignment()" class="btn btn-primary">Create Assignment</button>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import rule from './rule.vue';
    import clipboard from 'clipboard';

    export default {
        components: {
            "rule": rule
        },
        data () {
            return {
                deletedRuleStack: [],
                selectedRules: [],
                courses: [],
                deleteAssnIndex: null,
                deleteCourseIndex: null,
                currentAssnIndex: 0,
                currentCourseIndex: 0,
                plusFormActive: false,
                addNum: null,
                addDesc: null,
                editName: false,
                originalName: '',       //querying assignments is done with it's name, so we need to keep track of this.
                editTotalPts: false,
                clipboard: new clipboard('#copyToClipboard').on('success', (e) => e.clearSelection())
            }
        },
        filters: {
            positive: function(num) {
                if (num > 0) return `+${num}`;
                return num;
            }
        },
        computed: {
            actualPts: function() { //add up all selected pts and subtract from totalPts
                return this.selectedRules.reduce((acc, el) => acc + ((typeof(el.pts) === 'number') ? el.pts : 0), this.currentAssn.totalPts);
            },
            assnToDelete: function(){
                if (this.currentCourseIndex >= this.courses.length || this.deleteAssnIndex === null) return '';
                return this.courses[this.currentCourseIndex].assignments[this.deleteAssnIndex].name;
            },
            courseToDelete: function(){
                if (this.currentCourseIndex >= this.courses.length || this.deleteCourseIndex === null) return '';
                return this.courses[this.deleteCourseIndex].name;
            },
            hasAssignments: function(){
                if (this.courses.length === 0) return false;
                return this.courses[this.currentCourseIndex].assignments.length > 0;
            },
            currentAssn: function(){
              return this.courses[this.currentCourseIndex].assignments[this.currentAssnIndex];
            }
        },
        watch: {
            'rules.length': function(){
                //Only used to push all comments down to the bottom of the list.
                this.rules.sort((a, b) => {
                    if (a.pts == null || a.pts === 0) return 1;
                    if (b.pts == null || b.pts === 0) return -1;
                    return 0;
                });
            }
        },
        methods: {
            deleteRule: function(payload) {
                this.deletedRuleStack.push(this.currentAssn.rules.splice(payload.index, 1));
            },
            addRule: function() {
                //if a rule is added without points, it is accepted as a comment
                if (!this.addDesc) return;
                if (this.addNum === 0 || this.addNum === null) this.addNum = '';

                this.currentAssn.rules.push({
                    pts: this.addNum,
                    desc: this.addDesc
                });
                this.addNum = null;
                this.addDesc = null;
                this.plusFormActive = false;
            },
            checkrule: function(payload) {
                this.selectedRules.push({
                    id: payload.id,
                    pts: payload.rule.pts,
                    desc: payload.rule.desc
                });
            },
            uncheckrule: function(payload) {
                this.selectedRules = this.selectedRules.filter(function(obj) {
                    return obj.id !== payload.id;
                });
            },
            ruleChanged: function(payload) {
                let rule = this.currentAssn.rules[payload.index];
                rule.desc = payload.desc;
                rule.pts = parseInt(payload.pts);
            },
            commentsAtBottom: function(arr){
              //We don't want to mutate the original array, so we make a deep copy.
              const notMutable = JSON.parse(JSON.stringify(arr));
              return notMutable.sort(function(a, b){
                if (a.pts === '' && b.pts === '') return 0;
                if (a.pts === '') return 1;
                if (b.pts === '') return -1;
                return 0;
              });
            },
            saveChanges: function(event) {
                const changes = {'name': this.currentAssn.name, 'totalPts' : this.currentAssn.totalPts, 'rules' : this.currentAssn.rules};
                this.$apiCall(`/api/v1/courses/${this.courses[this.currentCourseIndex].id}/assignments/${this.originalName || this.currentAssn.name}`, 'PUT', changes)
                  .catch( err => console.log(err));
                this.originalName = '';
            },
            createAssignment: function() {
                this.selectedRules = [];
                this.deletedRuleStack = [];
                this.plusFormActive = false;
                const newAssignment = { name: 'New Assignment', rules: [], totalPts: 100 };
                const newAssnIndex = this.courses[this.currentCourseIndex].assignments.push(newAssignment) - 1;

                this.$apiCall(`/api/v1/courses/${this.courses[this.currentCourseIndex].id}/assignments`, 'POST', newAssignment)
                  .catch( err => console.log(err));

                this.switchAssignment(this.currentCourseIndex, newAssnIndex);
            },
            switchAssignment: function(courseIndex, assnIndex) {
                this.currentCourseIndex = courseIndex;
                this.currentAssnIndex = assnIndex;
                this.selectedRules = [];
                this.deletedRuleStack = [];
                this.plusFormActive = false;
            },
            removeAssignment(){
                this.courses[this.currentCourseIndex].assignments.splice(this.deleteAssnIndex, 1);
                this.editCourse(this.courses[this.currentCourseIndex]); //FIXME: find a way to remove array element -- not $pull
                if (this.deleteAssnIndex === this.currentAssnIndex) {
                  this.switchAssignment(this.currentCourseIndex, 0);
                  this.selectedRules = [];
                  this.deletedRuleStack = [];
                }

                //If removing an assignment before the current one, decrement currentAssnIndex to stay in the same Assn
                if (this.deleteAssnIndex < this.currentAssnIndex) this.currentAssnIndex--;

                this.deleteAssnIndex = null;
                this.$refs.assnDeletionModal.hide();
            },
            setActiveClass: function(event, elemClass, activeClass) {
                //elemClass: the class the list of elements share to be iterated over
                //activeClass: the class that the recently selected item should have applied
                let assignmentListItems = document.getElementsByClassName(elemClass);
                for (let i = 0; i < assignmentListItems.length; i++) {
                    assignmentListItems[i].classList.remove(activeClass);
                }
                event.target.classList.toggle(activeClass);
            },
            createCourse: function () {
                const newCourse = {name: "New Course", assignments: []};
                const self = this;
                this.$apiCall('/api/v1/courses', 'POST', newCourse)
                    .then( res => res.json() )
                    .then(function(course){
                        // Store the ID we get back from the initial create
                        newCourse.id = course.id;
                        newCourse.editing = false;    //Just used locally
                        self.currentCourseIndex = self.courses.push(newCourse) - 1;
                    })
                    .catch( err => console.log(err));
            },
            removeCourse: function () {
                let self = this;
                this.$apiCall(`/api/v1/courses/${this.courses[this.deleteCourseIndex].id}`, 'DELETE')
                    .then(function(){
                        self.courses.splice(self.deleteCourseIndex, 1);
                        if (self.deleteCourseIndex === self.currentCourseIndex) {
                            self.switchAssignment(0, 0);
                            self.selectedRules = [];
                            self.deletedRuleStack = [];
                         }
                        self.deleteCourseIndex = null;
                    })
                    .catch( err => console.log(err))

                this.$refs.courseDeletionModal.hide();
            },
            toggleCourseEdit: function(event, index) {
                event.stopPropagation();
                this.courses[index].editing = true;

                // Changes on object attributes and array elements don't trigger changes
                // Only changes to the object/array itself will trigger change event, which is what
                // updates the data in the two-way binding. Dirty way to trigger that change event:
                this.courses.push({});
                this.courses.pop();
            },
            editCourse: function (course) {
                delete course.editing;

                this.$apiCall(`/api/v1/courses/${course.id}`, 'PUT', course)
                    .then( () => course.editing = false )
                    .catch( err => console.log(err));

                // Trigger the change event to update data in the UI
                this.courses.push({});
                this.courses.pop();
            }
        },
        beforeCreate: function() {
            if (localStorage.getItem('token')) {
                if (localStorage.getItem('ta') != 'true') {
                    this.$router.push('login');
                }
            } else {
                this.$router.push('login');
            }
        },
        created: function() {
            let self = this;
            window.addEventListener('keydown', function(event) {
                // If Ctrl+Z is pressed
                if (event.ctrlKey && event.keyCode == 90 && self.deletedRuleStack.length > 0) {
                    let newRule = self.deletedRuleStack.pop();
                    self.currentAssn.rules.push({
                        pts: newRule[0].pts,
                        desc: newRule[0].desc
                    });
                }
            });
            this.$apiCall('/api/v1/courses', 'GET')
                .then(function(res){ return res.json() })
                .then(function(courses) {
                    self.courses = courses;
                    self.courses.map((course) => course.editing = false);
                    self.currentCourseIndex = 0;
                    self.currentAssnIndex = 0;
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }
</script>

<style>

</style>
