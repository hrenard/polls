var newUserDates = [];
var newUserTypes = [];

var max_votes = 0;
var values_changed = false;

$(document).ready(function () {
    var cells = [];
    cells = document.getElementsByClassName('cl_click');
    // loop over 'user' cells
    for (var i = 0; i < cells.length; i++){
        // fill arrays (if this is edit)
        if (cells[i].className.indexOf('poll-cell-active-not') >= 0){
            newUserTypes.push(0);
            newUserDates.push(cells[i].id);
        } else if (cells[i].className.indexOf('poll-cell-active-is') >= 0){
            newUserTypes.push(1);
            newUserDates.push(cells[i].id);
        } else if(cells[i].className.indexOf('poll-cell-active-maybe') >= 0){
            newUserTypes.push(2);
            newUserDates.push(cells[i].id);
        } else {
            newUserTypes.push(-1);
            newUserDates.push(cells[i].id);
        }
    }

    $('#button_home').click(function() {
        document.getElementById('j').value = 'home';
        document.finish_poll.submit();
    });

    $('#submit_finish_poll').click(function() {
        var form = document.finish_poll;
        var comm = document.getElementById('comment_box');
        var ac_user = '';
        var ac = document.getElementById('user_name');
        if (ac != null) {
            if(ac.value.length >= 3){
                ac_user = ac.value;
            } else {
                alert(t('polls', 'You are not registered.\nPlease enter your name to vote\n(at least 3 characters).'));
                return;
            }
        }
        check_notif = document.getElementById('check_notif');

        form.elements['options'].value = JSON.stringify({
            dates: newUserDates,
            values: newUserTypes,
            ac_user: ac_user,
            check_notif: ((check_notif && check_notif.checked) ? 'true' : 'false'),
            values_changed: (values_changed ? 'true' : 'false')
        });
        form.submit();
    });

    $('#submit_send_comment').click(function() {
        var form = document.send_comment;
        var comm = document.getElementById('comment_box');
        form.elements['options'].value = JSON.stringify({
            comment: comm.value,
        });
        form.submit();
    });
});

$(document).on('click', '.poll-cell-active-un', function(e) {
    values_changed = true;
    var ts = $(this).attr('id');
    var index = newUserDates.indexOf(ts);
    if(index > -1) {
        newUserDates.splice(index, 1);
        newUserTypes.splice(index, 1);
    }
    newUserDates.push(ts);
    newUserTypes.push(2);
    $(this).switchClass('poll-cell-active-un', 'poll-cell-active-maybe');
    $(this).switchClass('icon-info', 'icon-more');
});

$(document).on('click', '.poll-cell-active-not', function(e) {
    values_changed = true;
    var ts = $(this).attr('id');
    var index = newUserDates.indexOf(ts);
    if(index > -1) {
        newUserDates.splice(index, 1);
        newUserTypes.splice(index, 1);
    }
    newUserDates.push(ts);
    newUserTypes.push(2);
    var total_no = document.getElementById('id_n_' + ts);
    total_no.innerHTML = parseInt(total_no.innerHTML) - 1;
    $(this).switchClass('poll-cell-active-not', 'poll-cell-active-maybe');
    $(this).switchClass('icon-close', 'icon-more');
    findNewMaxCount();
    updateStrongCounts();
});

$(document).on('click', '.poll-cell-active-maybe', function(e) {
    values_changed = true;
    var ts = $(this).attr('id');
    var index = newUserDates.indexOf(ts);
    if(index > -1) {
        newUserDates.splice(index, 1);
        newUserTypes.splice(index, 1);
    }
    newUserDates.push(ts);
    newUserTypes.push(1);
    var total_yes = document.getElementById('id_y_' + ts);
    total_yes.innerHTML = parseInt(total_yes.innerHTML) + 1;
    $(this).switchClass('poll-cell-active-maybe', 'poll-cell-active-is');
    $(this).switchClass('icon-more', 'icon-checkmark');
    findNewMaxCount();
    updateStrongCounts();
});

$(document).on('click', '.poll-cell-active-is', function(e) {
    values_changed = true;
    var ts = $(this).attr('id');
    var index = newUserDates.indexOf(ts);
    if(index > -1) {
        newUserDates.splice(index, 1);
        newUserTypes.splice(index, 1);
    }
    newUserDates.push(ts);
    newUserTypes.push(0);
    var total_yes = document.getElementById('id_y_' + ts);
    var total_no = document.getElementById('id_n_' + ts);
    total_yes.innerHTML = parseInt(total_yes.innerHTML) - 1;
    total_no.innerHTML = parseInt(total_no.innerHTML) + 1;
    $(this).switchClass('poll-cell-active-is', 'poll-cell-active-not');
    $(this).switchClass('icon-checkmark', 'icon-close');
    findNewMaxCount();
    updateStrongCounts();
});

function findNewMaxCount(){
    var cell_tot_y = document.getElementsByClassName('cl_total_y');
    var cell_tot_n = document.getElementsByClassName('cl_total_n');
    max_votes = 0;
    for(var i=0; i<cell_tot_y.length; i++) {
        var currYes = parseInt(cell_tot_y[i].innerHTML);
        var currNo = parseInt(cell_tot_n[i].innerHTML);
        var curr = currYes - currNo;
        if(curr > max_votes) max_votes = curr;
    }
}

function updateStrongCounts(){
    var cell_tot_y = document.getElementsByClassName('cl_total_y');
    var cell_tot_n = document.getElementsByClassName('cl_total_n');

    for(var i=0; i<cell_tot_y.length; i++) {
        var cell_win = document.getElementById('id_total_' + i);
        var curr = parseInt(cell_tot_y[i].innerHTML) - parseInt(cell_tot_n[i].innerHTML);
        if(curr < max_votes) {
            cell_win.className = 'win_row';
                cell_tot_y[i].style.fontWeight = 'normal';
        }
        else {
            cell_tot_y[i].style.fontWeight = 'bold';
            cell_win.className = 'win_row icon-checkmark';
        }
    }
}
