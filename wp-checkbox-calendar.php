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

function wp_checkbox_calendar_enqueue() {
    wp_enqueue_script('fullcalendar-core', 'https://unpkg.com/@fullcalendar/core/main.min.js');
    wp_enqueue_style('fullcalendar-core', 'https://unpkg.com/@fullcalendar/core@4.3.1/main.min.css');
    wp_enqueue_script('fullcalendar-core-locales-he', 'https://cdn.jsdelivr.net/npm/@fullcalendar/core@4.3.1/locales/he.js');
    wp_enqueue_script('fullcalendar-daygrid', 'https://unpkg.com/@fullcalendar/daygrid/main.min.js');
    //wp_enqueue_style('fullcalendar-daygrid', 'https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@4.3.0/main.min.css');
    wp_enqueue_script('fullcalendar-interactions', 'https://unpkg.com/@fullcalendar/interaction/main.min.js');
    wp_enqueue_script('wp-checkbox-calendar-calendar', plugins_url('/js/calendar.js', __FILE__));
    wp_enqueue_style('wp-checkbox-calendar-style', plugins_url('wp-checkbox-calendar.css', __FILE__));
}
register_activation_hook( __FILE__, 'jal_install' );
add_action('wp_enqueue_scripts', 'wp_checkbox_calendar_enqueue');
add_shortcode('wp-checkbox-calendar', 'wp_checkbox_calendar_shortcode');