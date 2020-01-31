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

function wp_checkbox_check() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'cc_checks';
    $wpdb->insert($table_name, ['user_id'=> get_current_user_id(), 'check_date' => $_POST['date']]);
}

function wp_checkbox_calendar_enqueue() {
    wp_enqueue_script('fullcalendar-core', 'https://unpkg.com/@fullcalendar/core/main.min.js');
    wp_enqueue_style('fullcalendar-core', 'https://unpkg.com/@fullcalendar/core@4.3.1/main.min.css');
    wp_enqueue_script('fullcalendar-core-locales-he', 'https://cdn.jsdelivr.net/npm/@fullcalendar/core@4.3.1/locales/he.js');
    wp_enqueue_script('fullcalendar-daygrid', 'https://unpkg.com/@fullcalendar/daygrid/main.min.js');
    //wp_enqueue_style('fullcalendar-daygrid', 'https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@4.3.0/main.min.css');
    wp_enqueue_script('fullcalendar-interactions', 'https://unpkg.com/@fullcalendar/interaction/main.min.js');
    wp_enqueue_script('wp-checkbox-calendar-calendar', plugins_url('/js/calendar.js', __FILE__));
    global $wpdb;
    $table_name = $wpdb->prefix . 'cc_checks';
    $user_id = get_current_user_id();
    wp_localize_script( 'wp-checkbox-calendar-calendar', 'calendar_ajax_object', [
        'ajax_url' => admin_url( 'admin-ajax.php' ),
        'checked' => $wpdb->get_results("SELECT * FROM $table_name WHERE user_id = $user_id ORDER BY check_date ASC")]);
    wp_enqueue_style('wp-checkbox-calendar-style', plugins_url('wp-checkbox-calendar.css', __FILE__));
}

add_action('wp_enqueue_scripts', 'wp_checkbox_calendar_enqueue');
add_action( 'wp_ajax_checkbox_check', 'wp_checkbox_check');
add_shortcode('wp-checkbox-calendar', 'wp_checkbox_calendar_shortcode');
