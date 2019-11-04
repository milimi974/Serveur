var async = require('async');
// imported from cs-dc-poem.unistra.fr

module.exports = function (app) {
  var Lesson = app.models.lesson;
  var Speciality = app.models.speciality;
  var Question = app.models.question;
  var listLessons = require('./lessons_data.json');
  var listQuestions = require('./questions_data.json');
  var listAnswers = require('./answers_data.json');
  var countLesson = 0;
  var countQuestion = 0;

  async.each(listLessons, insert, join);

  function insert(less, callback) {
    Speciality.findOne({ where: { cip_code: less.cip_speciality } }, function (err, spe) {
      if (err) {
        callback(err);
        return;
      }
      less.id_speciality = spe.id;
      delete less.cip_speciality;

      Lesson.create(less, function (err, obj) {
        if (err)
          callback(err);
        else {
          countLesson++;
          obj.course_material.create ({path: less.link_filename, type: less.item_format}, function (err, o) {
            if (err)
              callback(err)
          })
          insertQuestion(obj.id, less.id_pedagogic_item, callback)
        }
      });
    });
  }

  function insertQuestion(lesson_id, pedagogic_item_id, callbackLesson) {
    var quests = listQuestions.filter(function (q) { return q.php_id_pedagogic_item == pedagogic_item_id });
    if (quests.length == 0) {
      console.log("No question was find for this lesson (id: " + lesson_id + ", pedagogic_item_id: " + pedagogic_item_id + ").");
      callbackLesson();
      return;
    }
    async.each(quests, function (q, callbackQuestion) {
      var ans = listAnswers.find(function (a) { return q.php_id_question == a.id_question });
      if (!ans) {
        console.log("No answer was found for this question : (id: " + q.php_id_question + ", pedagogic_item_id: " + pedagogic_item_id + ")");
        callbackQuestion();
        return;
      }
      q.expected_answer = ans.provided_answer;
      q.id_lesson = lesson_id;

      Question.create(q, function (err, obj) {
        if (!err)
          countQuestion++;
        callbackQuestion(err);
      });
    }, function (err) {
      if (err) console.log('Error in insertion of question ' + q + ' :' + err);
      callbackLesson();
    });
  }


  function join(err) {
    if (err) console.log('Error in lesson :' + err.message);
    console.log("\n- " + countLesson + " lessons and " + countQuestion + " questions inserted in the database.");
  }
}
