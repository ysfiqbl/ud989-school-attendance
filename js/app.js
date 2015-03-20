/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
    var model = {
        init: function() {
            this.attendance = JSON.parse(localStorage.attendance);
        },
    };

    var octopus = {
        init: function() {
            model.init();
            view.init();
        },
        getAttendances: function() {
            return model.attendance;
        },
        updateAttendance: function(newAttendance) {
            model.attendance = newAttendance;
            localStorage.attendance = JSON.stringify(newAttendance);
            view.render();
        }
    };

    var view = {
        init: function() {
            $allMissed = $('tbody .missed-col'),
            $allCheckboxes = $('tbody input');

            // Check boxes, based on attendace records
            $.each(octopus.getAttendances(), function(name, days) {
                var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                    dayChecks = $(studentRow).children('.attend-col').children('input');

                dayChecks.each(function(i) {
                    $(this).prop('checked', days[i]);
                });
            });

            // When a checkbox is clicked, update localStorage
            $allCheckboxes.on('click', function() {
                var studentRows = $('tbody .student'),
                    newAttendance = {};

                studentRows.each(function() {
                    var name = $(this).children('.name-col').text(),
                        $allCheckboxes = $(this).children('td').children('input');

                    newAttendance[name] = [];

                    $allCheckboxes.each(function() {
                        newAttendance[name].push($(this).prop('checked'));
                    });
                });
                octopus.updateAttendance(newAttendance);
            });

            this.render();
        },

        render: function() {
            $allMissed.each(function() {
                var studentRow = $(this).parent('tr'),
                    dayChecks = $(studentRow).children('td').children('input'),
                    numMissed = 0;

                dayChecks.each(function() {
                    if (!$(this).prop('checked')) {
                        numMissed++;
                    }
                });

                $(this).text(numMissed);
            });
        }
    };

    octopus.init();
}());
