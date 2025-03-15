<?php
/**
 * Plugin Name: WP Checkbox Calendar
 * Plugin URI: https://github.com/ShadovvBeast/wp-checkbox-calendar
 * Description: Checkbox calendar plugin for WordPress
 * Version: 0.1
 * Text Domain: wp-checkbox-calendar
 * Author: ShadowBeast (Asaf Levy)
 * Author URI: https://github.com/ShadovvBeast
 */
function wp_checkbox_calendar_shortcode($atts) {
    return '<div id="calendar"></div>';
}

function wp_checkbox_get_checked() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'cc_checks';
    $user_id = get_current_user_id();
    return $wpdb->get_results("SELECT * FROM $table_name WHERE user_id = $user_id ORDER BY check_date ASC");

}
function wp_checkbox_check() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'cc_checks';
    $wpdb->insert($table_name, ['user_id'=> get_current_user_id(), 'check_date' => $_POST['date']]);
    echo json_encode(wp_checkbox_get_checked());
}

function wp_checkbox_calendar_enqueue() {
    wp_enqueue_script('fullcalendar-core', 'https://cdn.jsdelivr.net/npm/@fullcalendar/core@4.3.1/main.min.js');
    wp_enqueue_style('fullcalendar-core', 'https://cdn.jsdelivr.net/npm/@fullcalendar/core@4.3.1/main.min.css');
    wp_enqueue_script('fullcalendar-core-locales-he', 'https://cdn.jsdelivr.net/npm/@fullcalendar/core@4.3.1/locales/he.js');
    wp_enqueue_script('fullcalendar-daygrid', 'https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@4.3');
    //wp_enqueue_style('fullcalendar-daygrid', 'https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@4.3.0/main.min.css');
    wp_enqueue_script('fullcalendar-interactions', 'https://cdn.jsdelivr.net/npm/@fullcalendar/interaction@4.3');
    wp_enqueue_script('wp-checkbox-calendar-calendar', plugins_url('/js/calendar.js', __FILE__));

    wp_localize_script( 'wp-checkbox-calendar-calendar', 'calendar_ajax_object', [
        'ajax_url' => admin_url( 'admin-ajax.php' ),
        'checked' => wp_checkbox_get_checked()]);
    wp_enqueue_style('wp-checkbox-calendar-style', plugins_url('wp-checkbox-calendar.css', __FILE__));
}

add_action('wp_enqueue_scripts', 'wp_checkbox_calendar_enqueue');
add_action( 'wp_ajax_checkbox_check', 'wp_checkbox_check');
add_shortcode('wp-checkbox-calendar', 'wp_checkbox_calendar_shortcode');

// Admin side
add_action('admin_menu', 'wp_checkbox_menu');

function wp_checkbox_menu(){
        add_menu_page( 'WP Checkbox', 'Reset Checkboxes', 'manage_options', 'reset-checkboxes', 'reset_checkboxes' );
}

function reset_checkboxes(){
    global $wpdb;
    $table_name = $wpdb->prefix . 'cc_checks';
    if (isset($_POST['action']) && $_POST['action'] === 'reset') {
        $email_count = count($_POST['emails']);
        $del_result = $wpdb->query("DELETE FROM $table_name WHERE user_id IN (SELECT id FROM wp_users WHERE user_email IN ('".implode( "','",$_POST['emails'])."'))");
        echo "<span class='isa_success'>Succesfully deleted ".$del_result." rows related to ".$email_count." email".($email_count > 1 ? 's' : '')."</span>";
    }

    $emails = $wpdb->get_results("SELECT DISTINCT user_email, display_name FROM wp_users
                        JOIN $table_name ON wp_users.id = wp_cc_checks.user_id");
    echo '
    <!DOCTYPE html>
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
    * {
      box-sizing: border-box;
    }

    body {
      font: 16px Arial;
    }

    /*the container must be positioned relative:*/
    .autocomplete {
      position: relative;
      display: inline-block;
    }

    input {
      border: 1px solid transparent;
      background-color: #f1f1f1;
      padding: 10px;
      font-size: 16px;
    }

    input[type=text] {
      background-color: #f1f1f1;
      width: 100%;
    }

    input[type=submit], input[name=add] {
      background-color: DodgerBlue;
      color: #fff;
      cursor: pointer;
    }

    .autocomplete-items {
      position: absolute;
      border: 1px solid #d4d4d4;
      border-bottom: none;
      border-top: none;
      z-index: 99;
      /*position the autocomplete items to be the same width as the container:*/
      top: 100%;
      left: 0;
      right: 0;
    }

    .autocomplete-items div {
      padding: 10px;
      cursor: pointer;
      background-color: #fff;
      border-bottom: 1px solid #d4d4d4;
    }

    /*when hovering an item:*/
    .autocomplete-items div:hover {
      background-color: #e9e9e9;
    }

    /*when navigating through the items using the arrow keys:*/
    .autocomplete-active {
      background-color: DodgerBlue !important;
      color: #ffffff;
    }

    .autocomplete-box {
        direction: ltr;
        float: right;
    }

    .remove_email {
        float: right;
        font-size: 35px;
        line-height: 0.3;
        color: #d6210d;
        cursor: pointer;
    }

    @import url(\'//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css\');

    .isa_info, .isa_success, .isa_warning, .isa_error {
    margin: 10px 0px;
    padding:12px;

    }
    .isa_info {
        color: #00529B;
        background-color: #BDE5F8;
    }
    .isa_success {
        color: #4F8A10;
        background-color: #DFF2BF;
    }
    .isa_warning {
        color: #9F6000;
        background-color: #FEEFB3;
    }
    .isa_error {
        color: #D8000C;
        background-color: #FFD2D2;
    }
    .isa_info i, .isa_success i, .isa_warning i, .isa_error i {
        margin:10px 22px;
        font-size:2em;
        vertical-align:middle;
    }
    </style>
    </head>
    <body>

    <h2>Reset by email</h2>
    <div class="autocomplete-box">
        <p>Start typing:</p>

        <!--Make sure the form has the autocomplete function switched off:-->
        <form autocomplete="off" method="POST" action="">
          <div class="autocomplete" style="width:300px;">
            <input id="myInput" type="text" name="email" placeholder="eMail">
          </div>
          <input type="hidden" name="action" value="reset">
          <ul id="email_list">
          </ul>
          <input type="submit">
        </form>
    </div>
    <script>
    $ = jQuery;
    let removed_arr = [];
    function autocomplete(inp, arr) {
      /*the autocomplete function takes two arguments,
      the text field element and an array of possible autocompleted values:*/
      var currentFocus;
      /*execute a function when someone writes in the text field:*/
      inp.addEventListener("input", function(e) {
          var a, b, i, val = this.value;
          /*close any already open lists of autocompleted values*/
          closeAllLists();
          if (!val) { return false;}
          currentFocus = -1;
          /*create a DIV element that will contain the items (values):*/
          a = document.createElement("DIV");
          a.setAttribute("id", this.id + "autocomplete-list");
          a.setAttribute("class", "autocomplete-items");
          /*append the DIV element as a child of the autocomplete container:*/
          this.parentNode.appendChild(a);
          /*for each item in the array...*/
          for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
              /*create a DIV element for each matching element:*/
              b = document.createElement("DIV");
              /*make the matching letters bold:*/
              b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
              b.innerHTML += arr[i].substr(val.length);
              /*insert a input field that will hold the current array item\'s value:*/
              b.innerHTML += "<input type=\'hidden\' value=\'" + arr[i] + "\'>";
              /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
                  /*insert the value for the autocomplete text field:*/
                  //inp.value = this.getElementsByTagName("input")[0].value;
                  const val = this.getElementsByTagName("input")[0].value;
                  const remove_email = $("<span></span>", {"class": "remove_email"}).append("-");
                  remove_email.click(e => {
                    remove_email.closest("li").remove();
                    arr.push(val);
                    removed_arr = removed_arr.filter(item => item !== val);
                  });
                  $(\'#email_list\').append($("<li></li>", {"class": "list_email"}).append($("<input />", {value: val, type: "hidden", name: "emails[]"}),$("<span></span>", {"class": "email_text"}).append(val, remove_email)));
                  removed_arr.push(val);
                  arr = arr.filter(item => item !== val);
                  inp.value = "";
                  /*close the list of autocompleted values,
                  (or any other open lists of autocompleted values:*/
                  closeAllLists();
              });
              a.appendChild(b);
            }
          }
      });
      /*execute a function presses a key on the keyboard:*/
      inp.addEventListener("keydown", function(e) {
          var x = document.getElementById(this.id + "autocomplete-list");
          if (x) x = x.getElementsByTagName("div");
          if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
              /*and simulate a click on the "active" item:*/
              if (x) x[currentFocus].click();
            }
          }
      });
      function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
      }
      function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }
      function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }
      /*execute a function when someone clicks in the document:*/
      document.addEventListener("click", function (e) {
          closeAllLists(e.target);
      });
    }

    var email_data = '.json_encode($emails).'

    autocomplete(document.getElementById("myInput"), email_data.map(d => d.user_email));
    </script>

    </body>
    </html>

    ';
}
