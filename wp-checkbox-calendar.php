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

function wp_checkbox_calendar_header() {
    ?>
    <script src="https://bundle.run/@fullcalendar/core@4.3.1"></script>
    <script src="https://bundle.run/@fullcalendar/daygrid@4.3.0"></script>
    <?php
}
wp_register_script('fullcalendar-core', 'https://bundle.run/@fullcalendar/core@4.3.1');
wp_register_script('fullcalendar-daygrid', 'https://bundle.run/@fullcalendar/daygrid@4.3.0');
wp_register_script('wp-checkbox-calendar-calendar', plugins_url('/js/calendar.js', __FILE__));
wp_enqueue_script('fullcalendar-core');
wp_enqueue_script('fullcalendar-daygrid');
wp_enqueue_script('wp-checkbox-calendar-calendar');
add_shortcode('wp-checkbox-calendar', 'wp_checkbox_calendar_shortcode');
