<template>
  <div class="container-fluid" id="app">
    <div class="row" style="color: #9e9e9e;">
      <div class="col align-self-center text-center collapse" id="collapseExample">To undo delete: <span style="color: orange;">Ctrl+Z</span></div>
    </div>
    <div class="row">
      <!-- title row -->
      <div class="col-xs-12 col-sm-3 assignmentListContainer">
        <h4 class="assignmentHdr">Assignments</h4>

        <!-- List Courses -->
        <div class="list-group courseList">
          <span v-for="(course, i) in courses">
            <a class="list-group-item clickable" style="color: black;" @click="switchCourse(i)">
              {{course.name}}
            </a>

            <!-- List Assignments within the course -->
            <a v-if="i === selectedCourse" class="list-group-item clickable" @click="switchAssignment(i, j)" v-for="(assignment, j) in course.assignments" style="color: black; padding: 0 0 0 50px;">
              {{assignment.name}}
            </a>
          </span>
        </div>

      </div>
      <div class="col-xs-12 col-sm-6 margMain">
        <div style="margin: auto; width: 75%;">
          <div class="container">
            <div class="row">
              <h2 class="assignmentName">{{name}}</h2>
            </div>
          </div>
          <hr class="line">
          <div class="container">
            <div class="row">
              <h4>{{totalPts}}<span class="ptsPts"> pts</span></h4>
            </div>
          </div>

          <!-- rules rows -->
          <div v-for="(rule, i) of rules" :key="rule.desc" class="container ruleRow">
            <div class="row align-items-center" v-model="selectedRules" v-bind:rule="rule" v-bind:index="i">
              <div class="col-9">
                <span style="color: white">
                  <span style="padding-right: 15px; color: white; font-weight: bolder;">
                    {{rule.pts | positive}}
                  </span>
                  {{rule.desc}}
                </span>
              </div>
            </div>
          </div>

          <!-- output rows -->
          <div v-if="actualPts < totalPts" class="alert alert-warning margMain" role="alert">
            <span v-for="selectedRule of selectedRules">{{selectedRule.pts | positive}} {{selectedRule.desc}}<br></span>
            <hr> {{actualPts}}
          </div>
          <div v-else class="alert alert-success margMain" role="alert">
            <span v-for="selectedRule of selectedRules">{{selectedRule.pts | positive}} {{selectedRule.desc}}<br></span>
            <b>Good Job</b>
            <hr> {{actualPts}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {//persisted data
        name: null,
        totalPts: 0,
        rules: [],
        //temporary gui state
        selectedRules: [],
        currentCourse: null,
        courses: [],
        selectedCourse: null,
        currentAssignment: null,
        assignments: [],
        currentCourseIndex: 0
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
        return this.selectedRules.reduce((acc, el) => acc + el.pts, this.totalPts);
      }
    },
    methods: {
      switchAssignment: function(courseIndex, assnIndex) {
        let newAssignment = this.courses[courseIndex].assignments[assnIndex];
        this.name = newAssignment.name;
        this.rules = newAssignment.rules;
        this.totalPts = newAssignment.totalPts;
        this.selectedRules = [];
        this.plusFormActive = false;
        this.currentAssignment = newAssignment;
      },
      switchCourse: function(courseIndex){
        this.currentCourseIndex = courseIndex;
        const firstAssn = this.courses[courseIndex].assignments[0];
        this.selectedCourse = courseIndex;
        this.name = firstAssn.name;
        this.totalPts = firstAssn.totalPts;
        this.rules = firstAssn.rules;
        this.assignments.push(firstAssn);
        this.currentAssignment = this.assignments[0];
      }
    },
    beforeCreate: function() {
      if (localStorage.getItem('token')) {
        // Do nothing, we have a token
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
          self.rules.push({
            pts: newRule[0].pts,
            desc: newRule[0].desc
          });
        }
      });
      this.$apiCall('/api/v1/courses', 'GET')
        .then(function(res){ return res.json() })
        .then(function(response) {
          const firstAssn = response[0].assignments[0];
          self.name = firstAssn.name;
          self.totalPts = firstAssn.totalPts;
          self.rules = firstAssn.rules;
          self.assignments.push(firstAssn);
          self.currentAssignment = self.assignments[0];
          self.courses = response;
          self.selectedCourse = 0;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }

  //TODO: GET course and assignment data relevant to the individual student
  //TODO: add a way for student to upload assignment submission
</script>

<style></style>
