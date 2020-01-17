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
    wp_enqueue_script('fullcalendar-core', 'https://bundle.run/@fullcalendar/core@4.3.1');
    wp_enqueue_script('fullcalendar-daygrid','https://bundle.run/@fullcalendar/daygrid@4.3.0');
    wp_enqueue_script('wp-checkbox-calendar-calendar', plugins_url('/js/calendar.js', __FILE__));
    wp_enqueue_style('wp-checkbox-calendar-style', plugins_url('wp-checkbox-calendar.css', __FILE__));
}
add_action('wp_enqueue_scripts', 'wp_checkbox_calendar_enqueue');
add_shortcode('wp-checkbox-calendar', 'wp_checkbox_calendar_shortcode');