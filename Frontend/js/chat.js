/*
	chat.js - display and send messages
	Copyright 2019 Jakob Stolze
 	This file is part of Helfy - https://github.com/Jugendhackt/Helfy
    Helfy is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    Helfy is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with Helfy.  If not, see <http://www.gnu.org/licenses/>.
    Diese Datei ist Teil von Helfy.
    Helfy ist Freie Software: Sie können es unter den Bedingungen
    der GNU General Public License, wie von der Free Software Foundation,
    Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
    veröffentlichten Version, weiter verteilen und/oder modifizieren.
    Helfy wird in der Hoffnung, dass es nützlich sein wird, aber
    OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
    Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
    Siehe die GNU General Public License für weitere Details.
    Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
    Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
*/

var server_url = getCookie("server_url");


var emjs = "";

var emjFl = `{"squared_sos": "1f198", "factory": "1f3ed", "four": "0034", "maple_leaf": "1f341", "building_construction": "1f3d7", "person_with_ball": "26f9", "wind_face": "1f32c", "waxing_gibbous_moon": "1f314", "up_button": "1f199", "bike": "1f6b2", "recycle": "267b", "victory_hand": "270c", "crying_face": "1f622", "thought_balloon": "1f4ad", "oncoming_automobile": "1f698", "face_throwing_a_kiss": "1f618", "artist_palette": "1f3a8", "school": "1f3eb", "video_game": "1f3ae", "running_shoe": "1f45f", "triumph": "1f624", "pig_face": "1f437", "bicycle": "1f6b2", "squared_free": "1f193", "suspension_railway": "1f69f", "nine_thirty": "1f564", "hankey": "1f4a9", "cactus": "1f335", "monorail": "1f69d", "heart_with_arrow": "1f498", "cooking": "1f373", "new": "1f195", "peace_symbol": "262e", "herb": "1f33f", "pouting_cat": "1f63e", "blue_heart": "1f499", "100": "1f4af", "leaves": "1f343", "roller_coaster": "1f3a2", "dragon_face": "1f432", "children_crossing": "1f6b8", "delivery_truck": "1f69a", "arrow_up_down": "2195", "mount_fuji": "1f5fb", "keycap_ten": "1f51f", "face_with_medical_mask": "1f637", "pound": "1f4b7", "pouting_face": "1f621", "circled_advantage_ideograph": "1f250", "red_car": "1f697", "top_arrow": "1f51d", "hospital": "1f3e5", "red_circle": "1f534", "world_map": "1f5fa", "end_arrow": "1f51a", "motor_boat": "1f6e5", "it": "1f1ee", "phone": "260e", "hole": "1f573", "pouch": "1f45d", "izakaya_lantern": "1f3ee", "blue_circle": "1f535", "mahjong_red_dragon": "1f004", "arrow_lower_left": "2199", "game_die": "1f3b2", "pushpin": "1f4cc", "squared_negation_ideograph": "1f21a", "dolphin": "1f42c", "night_with_stars": "1f303", "white_medium_small_square": "25fd", "kissing_closed_eyes": "1f61a", "earth_americas": "1f30e", "end": "1f51a", "rewind": "23ea", "pizza": "1f355", "briefcase": "1f4bc", "cat_face_with_wry_smile": "1f63c", "customs": "1f6c3", "bento_box": "1f371", "heartpulse": "1f497", "sparkler": "1f387", "sparkles": "2728", "index_pointing_up": "261d", "tulip": "1f337", "speaking_head": "1f5e3", "ambulance": "1f691", "umbrella_with_rain_drops": "2614", "office": "1f3e2", "clapper": "1f3ac", "satisfied": "1f606", "japan": "1f5fe", "post_office": "1f3e4", "dizzy_face": "1f635", "imp": "1f47f", "kimono": "1f458", "squared_id": "1f194", "red_paper_lantern": "1f3ee", "two_thirty": "1f55d", "coffee": "2615", "womans_sandal": "1f461", "back_arrow": "1f519", "open_mouth": "1f62e", "page_with_curl": "1f4c3", "bank": "1f3e6", "bread": "1f35e", "bright_button": "1f506", "backhand_index_pointing_down": "1f447", "oncoming_police_car": "1f694", "capricorn": "2651", "meat_on_bone": "1f356", "tokyo_tower": "1f5fc", "twelve_oclock": "1f55b", "fishing_pole_and_fish": "1f3a3", "thumbsdown": "1f44e", "no_one_under_eighteen": "1f51e", "telescope": "1f52d", "face_with_head_bandage": "1f915", "spider": "1f577", "u7121": "1f21a", "camera_with_flash": "1f4f8", "sweet_potato": "1f360", "lock_with_ink_pen": "1f50f", "ru": "1f1f7", "hushed": "1f62f", "baggage_claim": "1f6c4", "cherry_blossom": "1f338", "sparkle": "2747", "sweat_droplets": "1f4a6", "point_right": "1f449", "saxophone": "1f3b7", "fishing_pole": "1f3a3", "flower_playing_cards": "1f3b4", "hatching_chick": "1f423", "free": "1f193", "dashing": "1f4a8", "bullettrain_side": "1f684", "poultry_leg": "1f357", "grapes": "1f347", "smirk_cat": "1f63c", "lollipop": "1f36d", "black_medium_small_square": "25fe", "atm": "1f3e7", "notebook_with_decorative_cover": "1f4d4", "+1": "1f44d", "gift_heart": "1f49d", "scissors": "2702", "slot_machine": "1f3b0", "basketball": "1f3c0", "top": "1f51d", "clock630": "1f561", "railway_track": "1f6e4", "nail_care": "1f485", "crossed_flags": "1f38c", "smiling_face_with_open_mouth_and_tightly_closed_eyes": "1f606", "latin_cross": "271d", "minibus": "1f690", "shower": "1f6bf", "musical_score": "1f3bc", "dog2": "1f415", "loud_sound": "1f50a", "kaaba": "1f54b", "runner": "1f3c3", "passenger_ship": "1f6f3", "writing_hand": "270d", "rat": "1f400", "rice_scene": "1f391", "milky_way": "1f30c", "necktie": "1f454", "kissing_cat": "1f63d", "snowflake": "2744", "paintbrush": "1f58c", "crystal_ball": "1f52e", "koko": "1f201", "mouth": "1f444", "ballot_box_with_check": "2611", "eleven_oclock": "1f55a", "m": "24c2", "dog": "1f415", "map_of_japan": "1f5fe", "thumbs_down": "1f44e", "pineapple": "1f34d", "scream": "1f631", "bomb": "1f4a3", "satellite_antenna": "1f4e1", "radio": "1f4fb", "unicorn_face": "1f984", "squared_moon_ideograph": "1f237", "p_button": "1f17f", "cupid": "1f498", "new_moon_face": "1f31a", "squared_cool": "1f192", "rice": "1f35a", "tiger_face": "1f42f", "sunglasses": "1f576", "squared_finger_ideograph": "1f22f", "de": "1f1e9", "watch": "231a", "frowning": "1f626", "watermelon": "1f349", "wedding": "1f492", "squared_prohibit_ideograph": "1f232", "heart_with_ribbon": "1f49d", "microscope": "1f52c", "interrobang": "2049", "japanese_ogre": "1f479", "man_with_turban": "1f473", "star_and_crescent": "262a", "bridge_at_night": "1f309", "no_smoking": "1f6ad", "hammer": "1f528", "face_with_stuck_out_tongue": "1f61b", "postbox": "1f4ee", "circled_letter_m": "24c2", "wc": "1f6be", "aquarius": "2652", "weary": "1f629", "four_leaf_clover": "1f340", "one_thirty": "1f55c", "bottle_with_popping_cork": "1f37e", "cow": "1f404", "grey_exclamation": "2755", "white_large_square": "2b1c", "kissing_face_with_closed_eyes": "1f61a", "pig_nose": "1f43d", "ice_skate": "26f8", "upside_down_face": "1f643", "cloud_with_lightning": "1f329", "face_with_steam_from_nose": "1f624", "beer": "1f37a", "stadium": "1f3df", "airplane_departure": "1f6eb", "dog_face": "1f436", "heavy_division_sign": "2797", "clockwise_vertical_arrows": "1f503", "mushroom": "1f344", "record_button": "23fa", "face_with_rolling_eyes": "1f644", "ant": "1f41c", "smiling_face_with_open_mouth_and_cold_sweat": "1f605", "wind_chime": "1f390", "film_projector": "1f4fd", "anchor": "2693", "seven": "0037", "sushi": "1f363", "card_file_box": "1f5c3", "man_and_woman_holding_hands": "1f46b", "dizzy": "1f4ab", "arrow_forward": "25b6", "violin": "1f3bb", "mouse": "1f401", "id": "1f194", "fast_up_button": "23eb", "heart_decoration": "1f49f", "first_quarter_moon": "1f313", "mantelpiece_clock": "1f570", "satellite": "1f6f0", "hand": "270b", "christmas_tree": "1f384", "wrapped_present": "1f381", "broken_heart": "1f494", "face_with_stuck_out_tongue_and_tightly_closed_eyes": "1f61d", "ocean": "1f30a", "hearts": "2665", "pensive_face": "1f614", "snowman": "26c4", "up_arrow": "2b06", "yen": "1f4b4", "straight_ruler": "1f4cf", "sheaf_of_rice": "1f33e", "sleepy": "1f62a", "green_apple": "1f34f", "chart_increasing": "1f4c8", "white_medium_square": "25fb", "sunflower": "1f33b", "simple_smile": "1f642", "worried_face": "1f61f", "weary_face": "1f629", "innocent": "1f607", "cat_face_with_tears_of_joy": "1f639", "menorah": "1f54e", "ear_of_corn": "1f33d", "yin_yang": "262f", "sun_behind_large_cloud": "1f325", "clock130": "1f55c", "airplane_arrival": "1f6ec", "tear_off_calendar": "1f4c6", "gift": "1f381", "prayer_beads": "1f4ff", "stuck_out_tongue": "1f61b", "right_pointing_magnifying_glass": "1f50e", "pile_of_poo": "1f4a9", "open_mailbox_with_lowered_flag": "1f4ed", "crown": "1f451", "kissing_face": "1f617", "sparkling_heart": "1f496", "clubs": "2663", "police_officer": "1f46e", "gesturing_ok": "1f646", "person_with_pouting_face": "1f64e", "fog": "1f32b", "dango": "1f361", "large_orange_diamond": "1f536", "squared_ok": "1f197", "point_up": "261d", "corn": "1f33d", "eight_spoked_asterisk": "2733", "trophy": "1f3c6", "money_bag": "1f4b0", "four_thirty": "1f55f", "black_small_square": "25aa", "o": "2b55", "no_bell": "1f515", "curry": "1f35b", "sob": "1f62d", "waxing_crescent_moon": "1f312", "tiger2": "1f405", "two": "0032", "sos": "1f198", "soon": "1f51c", "compression": "1f5dc", "heavy_multiplication_x": "2716", "tennis": "1f3be", "beating_heart": "1f493", "fireworks": "1f386", "astonished": "1f632", "mobile_phone_with_arrow": "1f4f2", "congratulations": "3297", "person_bowing": "1f647", "grey_question": "2754", "arrow_upper_left": "2196", "kissing_face_with_smiling_eyes": "1f619", "arrow_double_up": "23eb", "triangular_flag_on_post": "1f6a9", "red_apple": "1f34e", "smiling_face_with_open_mouth_and_smiling_eyes": "1f604", "gemini": "264a", "ship": "1f6a2", "shit": "1f4a9", "movie_camera": "1f3a5", "dim_button": "1f505", "ng": "1f196", "evergreen": "1f332", "football": "1f3c8", "taurus": "2649", "articulated_lorry": "1f69b", "on_arrow": "1f51b", "police_car": "1f693", "lock_with_pen": "1f50f", "flushed": "1f633", "spades": "2660", "face_without_mouth": "1f636", "videocassette": "1f4fc", "wine_glass": "1f377", "clock830": "1f563", "smiling_face_with_horns": "1f608", "skis": "1f3bf", "department_store": "1f3ec", "crocodile": "1f40a", "white_square_button": "1f533", "curly_loop": "27b0", "mountain_cableway": "1f6a0", "melon": "1f348", "persevere": "1f623", "trident": "1f531", "u7a7a": "1f233", "hammer_and_wrench": "1f6e0", "cool": "1f192", "high_brightness": "1f506", "nerd_face": "1f913", "deciduous_tree": "1f333", "white_flower": "1f4ae", "registered": "00ae", "gun": "1f52b", "bus_stop": "1f68f", "shuffle_tracks_button": "1f500", "three_thirty": "1f55e", "arrow_left": "2b05", "old_key": "1f5dd", "small_orange_diamond": "1f538", "white_small_square": "25ab", "hocho": "1f52a", "card_index_dividers": "1f5c2", "file_folder": "1f4c1", "1234": "1f522", "smiling_imp": "1f608", "amphora": "1f3fa", "soft_ice_cream": "1f366", "baseball": "26be", "boy": "1f466", "raised_hands": "1f64c", "heavy_plus_sign": "2795", "bow": "1f647", "light_rail": "1f688", "massage": "1f486", "squared_divide_ideograph": "1f239", "police_cars_light": "1f6a8", "outbox_tray": "1f4e4", "clock330": "1f55e", "sake": "1f376", "confounded": "1f616", "angry": "1f620", "antenna_bars": "1f4f6", "pine_decoration": "1f38d", "crescent_moon": "1f319", "sweat_smile": "1f605", "aries": "2648", "ear_of_rice": "1f33e", "mouse2": "1f401", "baby_angel": "1f47c", "guardsman": "1f482", "envelope": "2709", "money_with_wings": "1f4b8", "beers": "1f37b", "gesturing_no": "1f645", "angry_face": "1f620", "studio_microphone": "1f399", "collision": "1f4a5", "car": "1f697", "cat": "1f408", "three": "0033", "running_shirt_with_sash": "1f3bd", "ferry": "26f4", "heart": "2764", "chart_with_upwards_trend": "1f4c8", "green_heart": "1f49a", "confused": "1f615", "old_woman": "1f475", "scorpius": "264f", "sailboat": "26f5", "open_mailbox_with_raised_flag": "1f4ec", "elephant": "1f418", "open_book": "1f4d6", "disappointed_relieved": "1f625", "squared_apply_ideograph": "1f238", "motorway": "1f6e3", "sun_with_face": "1f31e", "birthday": "1f382", "mag": "1f50d", "date": "1f4c5", "dove": "1f54a", "man": "1f468", "octopus": "1f419", "wheelchair": "267f", "truck": "1f69a", "sa": "1f202", "shield": "1f6e1", "haircut": "1f487", "six_thirty": "1f561", "down_arrow": "2b07", "last_quarter_moon_with_face": "1f31c", "rosette": "1f3f5", "currency_exchange": "1f4b1", "mailbox_with_no_mail": "1f4ed", "rolled_up_newspaper": "1f5de", "hourglass_with_flowing_sand": "23f3", "bath": "1f6c0", "mouse_face": "1f42d", "clock930": "1f564", "bowling": "1f3b3", "turtle": "1f422", "no_littering": "1f6af", "construction_worker": "1f477", "money_mouth_face": "1f911", "running_shirt": "1f3bd", "unlock": "1f513", "beetle": "1f41e", "man_with_chinese_cap": "1f472", "weight_lifter": "1f3cb", "es": "1f1ea", "exclamation": "2757", "water_wave": "1f30a", "o_button": "1f17e", "racing_car": "1f3ce", "slightly_smiling_face": "1f642", "face_massage": "1f486", "blue_book": "1f4d8", "reminder_ribbon": "1f397", "grimacing": "1f62c", "speaker_on": "1f509", "b_button": "1f171", "musical_note": "1f3b5", "high_heel": "1f460", "green_book": "1f4d7", "headphones": "1f3a7", "alien_monster": "1f47e", "stop_button": "23f9", "raised_fist": "270a", "kiss_mark": "1f48b", "yum": "1f60b", "smiling_cat_face_with_open_mouth": "1f63a", "ophiuchus": "26ce", "revolving_hearts": "1f49e", "one": "0031", "ring": "1f48d", "zap": "26a1", "sheep": "1f411", "bookmark": "1f516", "recycling_symbol": "267b", "spider_web": "1f578", "eyes": "1f440", "mobile_phone": "1f4f1", "waving_white_flag": "1f3f3", "memo": "1f4dd", "sweat_drops": "1f4a6", "middle_finger": "1f595", "television": "1f4fa", "down_button": "1f53d", "evergreen_tree": "1f332", "paw_prints": "1f43e", "scream_cat": "1f640", "seven_thirty": "1f562", "hourglass_flowing_sand": "23f3", "tophat": "1f3a9", "clock1230": "1f567", "tractor": "1f69c", "u6709": "1f236", "u6708": "1f237", "crying_cat_face": "1f63f", "angel": "1f47c", "parking": "1f17f", "dash": "1f4a8", "cow_face": "1f42e", "information_desk_person": "1f481", "anger": "1f4a2", "mailbox_with_mail": "1f4ec", "pencil2": "270f", "left_pointing_magnifying_glass": "1f50d", "wink": "1f609", "cityscape_at_dusk": "1f306", "thermometer": "1f321", "printer": "1f5a8", "tornado": "1f32a", "school_backpack": "1f392", "smiling_face_with_halo": "1f607", "smiling_cat_face_with_heart_shaped_eyes": "1f63b", "credit_card": "1f4b3", "checkered_flag": "1f3c1", "pager": "1f4df", "fried_shrimp": "1f364", "sunset": "1f307", "black_circle": "26ab", "detective": "1f575", "walking": "1f6b6", "large_blue_diamond": "1f537", "shoe": "1f45e", "city_sunset": "1f306", "shopping_bags": "1f6cd", "arrow_up": "2b06", "cloud_with_snow": "1f328", "chart_increasing_with_yen": "1f4b9", "gem": "1f48e", "negative_squared_cross_mark": "274e", "girl": "1f467", "face_with_tears_of_joy": "1f602", "e_mail": "1f4e7", "squared_together_ideograph": "1f234", "worried": "1f61f", "joker": "1f0cf", "cross_mark_button": "274e", "dollar_banknote": "1f4b5", "flexed_biceps": "1f4aa", "womans_boot": "1f462", "hear_no_evil": "1f649", "convenience_store": "1f3ea", "seat": "1f4ba", "do_not_litter": "1f6af", "pisces": "2653", "calendar": "1f4c5", "disappointed_but_relieved_face": "1f625", "loudspeaker": "1f4e2", "smiling_face_with_heart_shaped_eyes": "1f60d", "camping": "1f3d5", "bicyclist": "1f6b4", "label": "1f3f7", "diamonds": "2666", "raising_hand": "1f64b", "soccer_ball": "26bd", "uk": "1f1ec", "hot_pepper": "1f336", "jp": "1f1ef", "smiling_face_with_open_mouth": "1f603", "guitar": "1f3b8", "sun_behind_cloud_with_rain": "1f326", "pot_of_food": "1f372", "tropical_drink": "1f379", "repeat_single_button": "1f502", "restroom": "1f6bb", "shooting_star": "1f320", "flipper": "1f42c", "fast_forword_button": "23e9", "cancer": "264b", "jeans": "1f456", "kitchen_knife": "1f52a", "boar": "1f417", "boat": "26f5", "turkey": "1f983", "person_with_blond_hair": "1f471", "rabbit_face": "1f430", "high_speed_train_with_bullet_nose": "1f685", "stuck_out_tongue_closed_eyes": "1f61d", "helicopter": "1f681", "control_knobs": "1f39b", "performing_arts": "1f3ad", "tiger": "1f405", "kissing_cat_face_with_closed_eyes": "1f63d", "foggy": "1f301", "sound": "1f509", "blowfish": "1f421", "speech_balloon": "1f4ac", "seedling": "1f331", "envelope_with_arrow": "1f4e9", "american_football": "1f3c8", "black_large_square": "2b1b", "u5408": "1f234", "newspaper": "1f4f0", "squared_exist_ideograph": "1f236", "spiral_shell": "1f41a", "purse": "1f45b", "telephone": "260e", "sleeping": "1f634", "spouting_whale": "1f433", "synagogue": "1f54d", "house_buildings": "1f3d8", "joy_cat": "1f639", "mountain_biker": "1f6b5", "train2": "1f686", "bellhop_bell": "1f6ce", "diamond_shape_with_a_dot_inside": "1f4a0", "running": "1f3c3", "barber": "1f488", "ice_cream": "1f368", "input_symbols": "1f523", "burrito": "1f32f", "joystick": "1f579", "taxi": "1f695", "left_arrow_curving_right": "21aa", "u7533": "1f238", "dancers": "1f46f", "two_hump_camel": "1f42b", "snowboarder": "1f3c2", "rose": "1f339", "stopwatch": "23f1", "pill": "1f48a", "skier": "26f7", "orange_book": "1f4d9", "dart": "1f3af", "disappointed": "1f61e", "grin": "1f601", "place_of_worship": "1f6d0", "japanese_goblin": "1f47a", "arrows_counterclockwise": "1f504", "twelve_thirty": "1f567", "laughing": "1f606", "barber_pole": "1f488", "clap": "1f44f", "left_right_arrow": "2194", "japanese_castle": "1f3ef", "heart_eyes_cat": "1f63b", "bento": "1f371", "moon": "1f314", "tanabata_tree": "1f38b", "o2": "1f17e", "knife": "1f52a", "volcano": "1f30b", "kissing_heart": "1f618", "on": "1f51b", "om": "1f549", "ok": "1f197", "city_sunrise": "1f307", "package": "1f4e6", "arrow_right": "27a1", "chart_with_downwards_trend": "1f4c9", "wolf": "1f43a", "ox": "1f402", "dagger": "1f5e1", "one_oclock": "1f550", "zipper_mouth_face": "1f910", "syringe": "1f489", "oden": "1f362", "moon_ceremony": "1f391", "birthday_cake": "1f382", "white_check_mark": "2705", "face_with_cold_sweat": "1f613", "stars": "1f320", "chequered_flag": "1f3c1", "radio_button": "1f518", "arrow_heading_down": "2935", "rage": "1f621", "whale2": "1f40b", "atom_symbol": "269b", "vhs": "1f4fc", "strawberry": "1f353", "non-potable_water": "1f6b1", "star2": "1f31f", "grinning_cat_face_with_smiling_eyes": "1f638", "toilet": "1f6bd", "ab": "1f18e", "squared_katakana_sa": "1f202", "cinema": "1f3a6", "a_button": "1f170", "squared_cl": "1f191", "floppy_disk": "1f4be", "tshirt": "1f455", "telephone_receiver": "1f4de", "pensive": "1f614", "hot_dog": "1f32d", "folded_hands": "1f64f", "clock1030": "1f565", "flushed_face": "1f633", "poop": "1f4a9", "double_exclamation_mark": "203c", "pear": "1f350", "oil_drum": "1f6e2", "mask": "1f637", "smirk": "1f60f", "sunrise_over_mountains": "1f304", "partly_sunny": "26c5", "fountain_pen": "1f58b", "dollar": "1f4b5", "bulb": "1f4a1", "no_bicycles": "1f6b3", "man_with_gua_pi_mao": "1f472", "tv": "1f4fa", "open_hands": "1f450", "rotating_light": "1f6a8", "part_alternation_mark": "303d", "tm": "2122", "smile": "1f604", "large_blue_circle": "1f535", "fax": "1f4e0", "woman": "1f469", "ticket": "1f3ab", "ramen": "1f35c", "twisted_rightwards_arrows": "1f500", "cocktail_glass": "1f378", "right_anger_bubble": "1f5ef", "-1": "1f44e", "locomotive": "1f682", "cloud_with_rain": "1f327", "slightly_frowning_face": "1f641", "tea": "1f375", "zero": "0030", "ribbon": "1f380", "abc": "1f524", "purple_heart": "1f49c", "thumbs_up": "1f44d", "japanese_symbol_for_beginner": "1f530", "hash": "0023", "face_screaming_in_fear": "1f631", "person_pouting": "1f64e", "surfer": "1f3c4", "busstop": "1f68f", "new_moon": "1f311", "high_voltage": "26a1", "thumbsup": "1f44d", "face_with_stuck_out_tongue_and_winking_eye": "1f61c", "no_entry": "26d4", "name_badge": "1f4db", "classical_building": "1f3db", "hamster": "1f439", "pick": "26cf", "fleur_de_lis": "269c", "family": "1f46a", "rice_cracker": "1f358", "inbox_tray": "1f4e5", "next_track_button": "23ed", "tired_face": "1f62b", "carousel_horse": "1f3a0", "eye": "1f441", "poodle": "1f429", "reverse_button": "25c0", "megaphone": "1f4e3", "chestnut": "1f330", "door": "1f6aa", "sun_behind_small_cloud": "1f324", "mailbox_closed": "1f4ea", "mens_room": "1f6b9", "jack_o_lantern": "1f383", "derelict_house_building": "1f3da", "nine": "0039", "chocolate_bar": "1f36b", "v": "270c", "hamburger": "1f354", "accept": "1f251", "light_bulb": "1f4a1", "relieved_face": "1f60c", "airplane": "2708", "dress": "1f457", "speedboat": "1f6a4", "snowman_without_snow": "26c4", "ledger": "1f4d2", "goat": "1f410", "pause_button": "23f8", "fr": "1f1eb", "soon_arrow": "1f51c", "trident_emblem": "1f531", "fork_and_knife": "1f374", "fast_forward": "23e9", "cow2": "1f404", "red_triangle_pointed_down": "1f53b", "a": "1f170", "volleyball": "1f3d0", "dragon": "1f409", "wrench": "1f527", "point_up_2": "1f446", "egg": "1f373", "small_red_triangle": "1f53a", "computer_mouse": "1f5b1", "pray": "1f64f", "rugby_football": "1f3c9", "eight_oclock": "1f557", "soccer": "26bd", "play_or_pause_button": "23ef", "dolls": "1f38e", "monkey_face": "1f435", "bar_chart": "1f4ca", "european_castle": "1f3f0", "military_medal": "1f396", "smirking_face": "1f60f", "left_speech_bubble": "1f5e8", "rice_ball": "1f359", "trolleybus": "1f68e", "older_woman": "1f475", "lantern": "1f3ee", "information_source": "2139", "postal_horn": "1f4ef", "house": "1f3e0", "fish": "1f41f", "bride_with_veil": "1f470", "fist": "270a", "fearful_face": "1f628", "lipstick": "1f484", "fountain": "26f2", "cyclone": "1f300", "diamond_with_a_dot": "1f4a0", "traffic_light": "1f6a5", "repeat_button": "1f501", "cookie": "1f36a", "astonished_face": "1f632", "expressionless_face": "1f611", "heartbeat": "1f493", "castle": "1f3f0", "blush": "1f60a", "squared_vs": "1f19a", "sports_medal": "1f3c5", "fire_engine": "1f692", "feet": "1f43e", "horse": "1f40e", "moai": "1f5ff", "blossom": "1f33c", "automobile": "1f697", "station": "1f689", "clock730": "1f562", "t_shirt": "1f455", "banana": "1f34c", "relieved": "1f60c", "hotel": "1f3e8", "ten_oclock": "1f559", "aerial_tramway": "1f6a1", "panda_face": "1f43c", "b": "1f171", "ab_button": "1f18e", "six_pointed_star": "1f52f", "shaved_ice": "1f367", "chipmunk": "1f43f", "pedestrian": "1f6b6", "frowning_face_with_open_mouth": "1f626", "mountain": "26f0", "koala": "1f428", "dotted_six_pointed_star": "1f52f", "front_facing_baby_chick": "1f425", "u55b6": "1f23a", "globe_with_meridians": "1f310", "house_building": "1f3e0", "hamster_face": "1f439", "chart": "1f4b9", "squared_katakana_koko": "1f201", "clapper_board": "1f3ac", "mans_shoe": "1f45e", "kr": "1f1f0", "shinto_shrine": "26e9", "ideograph_advantage": "1f250", "golf": "26f3", "minidisc": "1f4bd", "crayon": "1f58d", "point_down": "1f447", "globe_showing_americas": "1f30e", "copyright": "00a9", "busts_in_silhouette": "1f465", "top_hat": "1f3a9", "nail_polish": "1f485", "alarm_clock": "23f0", "couplekiss": "1f48f", "circus_tent": "1f3aa", "sunny": "2600", "incoming_envelope": "1f4e8", "three_oclock": "1f552", "yellow_heart": "1f49b", "cry": "1f622", "yen_banknote": "1f4b4", "curry_rice": "1f35b", "speaker_loud": "1f50a", "x": "274c", "face_with_open_mouth": "1f62e", "eight_thirty": "1f563", "arrow_up_small": "1f53c", "art": "1f3a8", "party_popper": "1f389", "graduation_cap": "1f393", "four_oclock": "1f553", "hibiscus": "1f33a", "black_joker": "1f0cf", "raised_hand": "270b", "no_mouth": "1f636", "admission_tickets": "1f39f", "bear_face": "1f43b", "no_entry_sign": "1f6ab", "older_man": "1f474", "moyai": "1f5ff", "waving_black_flag": "1f3f4", "mailbox": "1f4eb", "statue_of_liberty": "1f5fd", "mega": "1f4e3", "person_taking_bath": "1f6c0", "eggplant": "1f346", "shortcake": "1f370", "wolf_face": "1f43a", "bell": "1f514", "battery": "1f50b", "wastebasket": "1f5d1", "dancer": "1f483", "page_facing_up": "1f4c4", "church": "26ea", "bell_with_slash": "1f515", "underage": "1f51e", "secret": "3299", "clock430": "1f55f", "closed_mailbox_with_raised_flag": "1f4eb", "ram": "1f40f", "u7981": "1f232", "pound_banknote": "1f4b7", "fire": "1f525", "cold_sweat": "1f630", "heart_eyes": "1f60d", "earth_africa": "1f30d", "arrow_right_hook": "21aa", "french_fries": "1f35f", "closed_umbrella": "1f302", "bikini": "1f459", "vertical_traffic_light": "1f6a6", "kissing": "1f617", "loop": "27bf", "raised_hand_with_fingers_splayed": "1f590", "two_women_holding_hands": "1f46d", "heavy_dollar_sign": "1f4b2", "spiral_calendar": "1f5d3", "helmet_with_white_cross": "26d1", "shirt": "1f455", "five_oclock": "1f554", "right_arrow": "27a1", "left_luggage": "1f6c5", "honeybee": "1f41d", "point_left": "1f448", "open_lock": "1f513", "fork_and_knife_with_plate": "1f37d", "arrow_heading_up": "2934", "snail": "1f40c", "arrow_down_small": "1f53d", "leopard": "1f406", "eleven_thirty": "1f566", "cityscape": "1f3d9", "six_oclock": "1f555", "euro": "1f4b6", "clinking_beer_mugs": "1f37b", "smile_cat": "1f638", "triangular_ruler": "1f4d0", "clock2": "1f551", "clock3": "1f552", "flags": "1f38f", "clock4": "1f553", "smiling_face_with_sunglasses": "1f60e", "love_hotel": "1f3e9", "speak_no_evil": "1f64a", "eyeglasses": "1f453", "double_curly_loop": "27bf", "nine_oclock": "1f558", "dromedary_camel": "1f42a", "womans_hat": "1f452", "sandal": "1f461", "carp_streamer": "1f38f", "cherries": "1f352", "full_moon": "1f315", "chart_decreasing": "1f4c9", "couple": "1f46b", "ballot_box_with_ballot": "1f5f3", "womans_clothes": "1f45a", "bangbang": "203c", "stuck_out_tongue_winking_eye": "1f61c", "bamboo": "1f38d", "mahjong": "1f004", "old_man": "1f474", "recreational_vehicle": "1f699", "waning_gibbous_moon": "1f316", "back": "1f519", "lips": "1f444", "candle": "1f56f", "robot_face": "1f916", "pen": "1f58a", "last_track_button": "23ee", "heavy_minus_sign": "2796", "nose": "1f443", "facepunch": "1f44a", "zzz": "1f4a4", "musical_notes": "1f3b6", "stew": "1f372", "santa": "1f385", "anger_symbol": "1f4a2", "tropical_fish": "1f420", "speaker_off": "1f507", "field_hockey": "1f3d1", "circled_accept_ideograph": "1f251", "school_satchel": "1f392", "office_building": "1f3e2", "oncoming_fist": "1f44a", "womens": "1f6ba", "baby_symbol": "1f6bc", "baby_chick": "1f424", "non_potable_water": "1f6b1", "last_quarter_moon": "1f317", "tada": "1f389", "clock530": "1f560", "question": "2753", "triangular_flag": "1f6a9", "five_thirty": "1f560", "ten_thirty": "1f565", "iphone": "1f4f1", "relaxed": "263a", "level_slider": "1f39a", "link": "1f517", "penguin": "1f427", "electric_plug": "1f50c", "skull": "1f480", "fries": "1f35f", "up": "1f199", "us": "1f1fa", "athletic_shoe": "1f45f", "confused_face": "1f615", "euro_banknote": "1f4b6", "hatched_chick": "1f425", "black_nib": "2712", "warning": "26a0", "bow_and_arrow": "1f3f9", "rainbow": "1f308", "lemon": "1f34b", "peach": "1f351", "steam_locomotive": "1f682", "red_triangle_pointed_up": "1f53a", "oncoming_bus": "1f68d", "input_numbers": "1f522", "smiley": "1f603", "u6e80": "1f235", "black_medium_square": "25fc", "closed_book": "1f4d5", "desert": "1f3dc", "expressionless": "1f611", "dvd": "1f4c0", "mag_right": "1f50e", "fast_reverse_button": "23ea", "desert_island": "1f3dd", "scroll": "1f4dc", "rabbit": "1f407", "face_savouring_delicious_food": "1f60b", "european_post_office": "1f3e4", "water_closet": "1f6be", "alien": "1f47d", "first_quarter_moon_with_face": "1f31b", "gb": "1f1ec", "japanese_dolls": "1f38e", "golfer": "1f3cc", "anguished": "1f627", "mosque": "1f54c", "eight_pointed_black_star": "2734", "wave": "1f44b", "small_airplane": "1f6e9", "anticlockwise_arrows_button": "1f504", "railway_car": "1f683", "notes": "1f3b6", "no_good": "1f645", "litter_in_bin_sign": "1f6ae", "trackball": "1f5b2", "spaghetti": "1f35d", "squared_empty_ideograph": "1f233", "love_letter": "1f48c", "clipboard": "1f4cb", "baby_bottle": "1f37c", "bird": "1f426", "couch_and_lamp": "1f6cb", "input_latin_lowercase": "1f521", "card_index": "1f4c7", "punch": "1f44a", "leo": "264c", "house_with_garden": "1f3e1", "see_no_evil": "1f648", "metro": "1f687", "popcorn": "1f37f", "teacup_without_handle": "1f375", "heavy_large_circle": "2b55", "smiling_face": "263a", "apple": "1f34e", "smiling_face_with_smiling_eyes": "1f60a", "clock230": "1f55d", "mens": "1f6b9", "cloud": "2601", "honey_pot": "1f36f", "frog": "1f438", "camera": "1f4f7", "crab": "1f980", "video_camera": "1f4f9", "sleeping_face": "1f634", "pencil": "270f", "mountain_bicyclist": "1f6b5", "tangerine": "1f34a", "womens_room": "1f6ba", "train": "1f686", "water_buffalo": "1f403", "baby": "1f476", "palm_tree": "1f334", "right_arrow_curving_left": "21a9", "sleepy_face": "1f62a", "capital_abcd": "1f520", "put_litter_in_its_place": "1f6ae", "coffin": "26b0", "abcd": "1f521", "lock": "1f512", "pig2": "1f416", "trumpet": "1f3ba", "cat_face": "1f431", "clock12": "1f55b", "six": "0036", "leftwards_arrow_with_hook": "21a9", "earth_asia": "1f30f", "heavy_check_mark": "2714", "backhand_index_pointing_left": "1f448", "notebook": "1f4d3", "taco": "1f32e", "tomato": "1f345", "mute": "1f507", "funeral_urn": "26b1", "symbols": "1f523", "motorcycle": "1f3cd", "persevering_face": "1f623", "paperclip": "1f4ce", "moneybag": "1f4b0", "full_moon_with_face": "1f31d", "neutral_face": "1f610", "glowing_star": "1f31f", "signal_strength": "1f4f6", "snake": "1f40d", "kiss": "1f48f", "blue_car": "1f699", "confetti_ball": "1f38a", "beer_mug": "1f37a", "white_medium_star": "2b50", "optical_disc": "1f4bf", "tram": "1f68a", "input_latin_letters": "1f524", "repeat_one": "1f502", "smiley_cat": "1f63a", "glasses": "1f453", "beginner": "1f530", "mobile_phone_off": "1f4f4", "books": "1f4da", "person_raising_hands": "1f64c", "8ball": "1f3b1", "hundred_points": "1f4af", "cocktail": "1f378", "steaming_bowl": "1f35c", "umbrella": "2614", "cooked_rice": "1f35a", "princess": "1f478", "squared_fullness_ideograph": "1f235", "passport_control": "1f6c2", "small_blue_diamond": "1f539", "gem_stone": "1f48e", "bouquet": "1f490", "fish_cake_with_swirl": "1f365", "two_oclock": "1f551", "loudly_crying_face": "1f62d", "national_park": "1f3de", "monkey": "1f412", "closed_lock_with_key": "1f510", "thinking_face": "1f914", "anguished_face": "1f627", "shell": "1f41a", "small_red_triangle_down": "1f53b", "nut_and_bolt": "1f529", "goblin": "1f47a", "direct_hit": "1f3af", "unamused": "1f612", "fuelpump": "26fd", "bed": "1f6cf", "bee": "1f41d", "round_pushpin": "1f4cd", "bookmark_tabs": "1f4d1", "tram_car": "1f68b", "microphone": "1f3a4", "play_button": "25b6", "billiards": "1f3b1", "backhand_index_pointing_up": "1f446", "hourglass": "231b", "backhand_index_pointing_right": "1f449", "eight": "0038", "japanese_post_office": "1f3e3", "handbag": "1f45c", "arrows_clockwise": "1f503", "pouting_cat_face": "1f63e", "grimacing_face": "1f62c", "new_moon_with_face": "1f31a", "heavy_exclamation_mark": "2757", "squared_new": "1f195", "horse_racing": "1f3c7", "chicken": "1f414", "umbrella_on_ground": "26f1", "arrow_lower_right": "2198", "scorpion": "1f982", "waning_crescent_moon": "1f318", "virgo": "264d", "libra": "264e", "disappointed_face": "1f61e", "sagittarius": "2650", "confounded_face": "1f616", "horizontal_traffic_light": "1f6a5", "bear": "1f43b", "no_mobile_phones": "1f4f5", "women_partying": "1f46f", "calling": "1f4f2", "oncoming_taxi": "1f696", "ogre": "1f479", "computer": "1f4bb", "arrow_down": "2b07", "ferris_wheel": "1f3a1", "grinning_face_with_smiling_eyes": "1f601", "fast_down_button": "23ec", "cat2": "1f408", "cloud_with_lightning_and_rain": "26c8", "icecream": "1f366", "globe_showing_asia_australia": "1f30f", "cross_mark": "274c", "pistol": "1f52b", "email": "2709", "cheese_wedge": "1f9c0", "tent": "26fa", "joy": "1f602", "file_cabinet": "1f5c4", "key": "1f511", "couple_with_heart": "1f491", "low_brightness": "1f505", "santa_claus": "1f385", "ok_woman": "1f646", "space_invader": "1f47e", "cn": "1f1e8", "cl": "1f191", "globe_showing_europe_africa": "1f30d", "cd": "1f4bf", "roasted_sweet_potato": "1f360", "swimmer": "1f3ca", "wavy_dash": "3030", "high_speed_train": "1f684", "cop": "1f46e", "two_hearts": "1f495", "smoking": "1f6ac", "open_file_folder": "1f4c2", "fearful": "1f628", "grinning": "1f600", "left_arrow": "2b05", "bathtub": "1f6c1", "ping_pong": "1f3d3", "timer_clock": "23f2", "lady_beetle": "1f41e", "u5272": "1f239", "rooster": "1f413", "vs": "1f19a", "vulcan_salute": "1f596", "frame_with_picture": "1f5bc", "bullettrain_front": "1f685", "white_circle": "26aa", "squared_ng": "1f196", "balloon": "1f388", "leaf_fluttering_in_wind": "1f343", "speaker": "1f508", "person_in_bed": "1f6cc", "u6307": "1f22f", "arrow_double_down": "23ec", "whale": "1f40b", "hushed_face": "1f62f", "unamused_face": "1f612", "growing_heart": "1f497", "badminton": "1f3f8", "muscle": "1f4aa", "spiral_notepad": "1f5d2", "rocket": "1f680", "camel": "1f42a", "boot": "1f462", "flag_in_hole": "26f3", "flashlight": "1f526", "high_heeled_shoe": "1f460", "desktop_computer": "1f5a5", "ski": "1f3bf", "musical_keyboard": "1f3b9", "boom": "1f4a5", "potable_water": "1f6b0", "sun_behind_cloud": "26c5", "clock1": "1f550", "face_with_thermometer": "1f912", "hugging_face": "1f917", "five": "0035", "clock5": "1f554", "clock6": "1f555", "clock7": "1f556", "clock8": "1f557", "clock9": "1f558", "doughnut": "1f369", "atm_sign": "1f3e7", "linked_paperclips": "1f587", "candy": "1f36c", "two_men_holding_hands": "1f46c", "hotsprings": "2668", "squared_operating_ideograph": "1f23a", "fax_machine": "1f4e0", "bust_in_silhouette": "1f464", "e-mail": "1f4e7", "chains": "26d3", "sign_of_the_horns": "1f918", "kissing_smiling_eyes": "1f619", "fish_cake": "1f365", "prohibited": "1f6ab", "no_pedestrians": "1f6b7", "arrow_backward": "25c0", "closed_mailbox_with_lowered_flag": "1f4ea", "film_frames": "1f39e", "clock10": "1f559", "clock11": "1f55a", "sweat": "1f613", "mountain_railway": "1f69e", "tongue": "1f445", "black_square_button": "1f532", "headphone": "1f3a7", "face_with_open_mouth_and_cold_sweat": "1f630", "laptop_computer": "1f4bb", "ok_hand": "1f44c", "custard": "1f36e", "rowboat": "1f6a3", "fuel_pump": "26fd", "winking_face": "1f609", "clapping_hands": "1f44f", "lion_face": "1f981", "cricket": "1f3cf", "bus": "1f68c", "construction": "1f6a7", "fallen_leaf": "1f342", "frog_face": "1f438", "ear": "1f442", "bug": "1f41b", "happy_person_raising_hand": "1f64b", "snow_capped_mountain": "1f3d4", "seven_oclock": "1f556", "eject_button": "23cf", "cake": "1f370", "mortar_board": "1f393", "waving_hand": "1f44b", "pig": "1f416", "input_latin_uppercase": "1f520", "ice_hockey_stick_and_puck": "1f3d2", "person_frowning": "1f64d", "horse_face": "1f434", "arrow_upper_right": "2197", "book": "1f4d6", "clock1130": "1f566", "sunrise": "1f305", "racehorse": "1f40e", "beach_with_umbrella": "1f3d6", "repeat": "1f501", "star": "2b50", "rabbit2": "1f407", "footprints": "1f463", "ghost": "1f47b", "droplet": "1f4a7", "vibration_mode": "1f4f3", "weary_cat_face": "1f640", "grinning_face": "1f600", "man_in_business_suit_levitating": "1f574"}`;

emjs = JSON.parse(emjFl);

var emjsX = [];
for(x in emjs){
    emjsX.push(":" + x + ":");
}

var drdw = emjsX;

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = "helfy_" + cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
    var name = "helfy_" + cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

async function getChats() {
    var l_username = getCookie("username");
    var l_session = getCookie("session");
    if (getQueryVariable("p") != "") {
        var fullurl = server_url + '/backend/index.php?request=getChat&username=' + l_username + "&session=" + l_session + "&partner=" + getQueryVariable("p");
        try {
            let request = await fetch(fullurl, {
                method: "GET",
                dataType: "application/x-www-form-urlencoded",
            });

            data = await request.json();

            document.getElementById("notificationB").innerHTML = "";
            if (data == "invalid_receiver") {
                var nBox = document.getElementById("notification");
                var noti = document.createElement("div");
                document.getElementById("menu").style.display = "none";
                document.getElementById("backbutton").style.display = "";
                document.getElementById("footer").style.display = "none";
                document.getElementById("helfy-header").style.display = "none";
                document.getElementById("header").style.display = "";
                document.getElementById("searchUser").style.display = "none";
                document.getElementById("header").innerHTML = "<a href='profile.html?user=" + getQueryVariable("p") + "' style='color: black;'>" + getQueryVariable("p") + "</a>";
                noti.setAttribute("class", "formular");
                noti.innerHTML = "Es existiert keine Person mit dem Nutzernamen <i>@" + getQueryVariable("p") + "</i>";
                noti.style.textAlign = "center";
                noti.style.width = "92%";
                noti.style.marginTop = "10%";
                nBox.appendChild(noti);
                nBox.setAttribute("class", "");
                document.getElementById("sendmdiv").remove()
            } else if (data != "failed") {
                ntfcn = data;
                notified = true;
                document.getElementById("notification").innerHTML = "";
                for (var i = 0; i < ntfcn.length; i++) {
                    ntfcn[i]["message"] = emojisShortToHtml(ntfcn[i]["message"]);
                    var nBox = document.getElementById("notification");
                    var noti = document.createElement("div");
                    document.getElementById("menu").style.display = "none";
                    document.getElementById("backbutton").style.display = "";
                    document.getElementById("footer").style.display = "none";
                    document.getElementById("helfy-header").style.display = "none";
                    document.getElementById("header").style.display = "";
                    document.getElementById("searchUser").style.display = "none";
                    document.getElementById("header").innerHTML = "<a href='profile.html?user=" + getQueryVariable("p") + "' style='color: black;'>" + getQueryVariable("p") + "</a>";
                    noti.setAttribute("role", "alert");
                    noti.setAttribute("id", "alert" + i);
                    noti.style.wordWrap = "break-word";
                    if (ntfcn[i]["sender"] == l_username) {
                        noti.setAttribute("class", "alert alert-success");
                        noti.style.width = "80%";
                        noti.style.float = "right";
                        noti.style.marginRight = "0.5%";
                        noti.innerHTML = ntfcn[i]["message"] + "<br>" + "<i><font style='font-size: 10px; float: right;'>" + ntfcn[i]["timestamp"] + "</i></font>";
                        nBox.appendChild(noti);
                        notified = false;
                        document.getElementById("alert" + i).scrollIntoView()
                    } else {
                        noti.setAttribute("class", "alert alert-primary");
                        noti.style.width = "80%";
                        noti.style.float = "left";
                        noti.style.marginLeft = "0.5%";
                        noti.innerHTML = ntfcn[i]["message"] + "<br>" + "<font style='font-size: 10px; float: right;'><i>" + ntfcn[i]["timestamp"] + "</i></font>";
                        nBox.appendChild(noti);
                        notified = false;
                        document.getElementById("alert" + i).scrollIntoView()
                    }
                }
                if (notified) {
                    var nBox = document.getElementById("notification");
                    var noti = document.createElement("div");
                    document.getElementById("menu").style.display = "none";
                    document.getElementById("backbutton").style.display = "";
                    document.getElementById("footer").style.display = "none";
                    document.getElementById("helfy-header").style.display = "none";
                    document.getElementById("header").style.display = "";
                    document.getElementById("searchUser").style.display = "none";
                    document.getElementById("header").innerHTML = "<a href='profile.html?user=" + getQueryVariable("p") + "' style='color: black;'>" + getQueryVariable("p") + "</a>";
                    noti.setAttribute("role", "alert");
                    noti.setAttribute("id", "alert" + i);
                    noti.setAttribute("class", "alert alert-dark");
                    noti.innerHTML = 'Keine Nachrichten in diesem Chat.';
                    nBox.appendChild(noti);
                }
            } else {
                var nBox = document.getElementById("notification");
                var noti = document.createElement("div");
                noti.setAttribute("class", "formular");
                noti.innerHTML = "Falsche oder fehlende Nutzerdaten.<br>Bitte melden Sie sich erneut an!<br><br><button class='btn btn-primary' onclick='self.location.href=\"login.html\"'>zurück zum Login</button>";
                noti.style.textAlign = "center";
                nBox.appendChild(noti);
                nBox.setAttribute("class", "");
                document.getElementById("sendmdiv").innerHTML = "";
            }
            console.log("fetch success");

        } catch (e) {
            console.error('fetch error', e);
            data = "fetch_error";
        }
    } else {
        var fullurl = server_url + '/backend/index.php?request=getChats&username=' + l_username + "&session=" + l_session;
        try {
            document.getElementById("sendmdiv").remove()
        } catch (e) {
            console.error(e);
        }
        try {
            let request = await fetch(fullurl, {
                method: "GET",
                dataType: "application/x-www-form-urlencoded",
            });

            data = await request.text();
            if (data != "failed") {
                ntfcn = JSON.parse(data);
                console.log(data);
                notified = true;
                document.getElementById("notification").innerHTML = "";
                for (i in ntfcn) {
                    var nBox = document.getElementById("notificationB");
                    var noti = document.createElement("div");
                    noti.setAttribute("role", "alert");
                    noti.setAttribute("id", "alert" + i);
                    noti.setAttribute("class", "alert alert-success");
                    noti.innerHTML = '<h5 class="alert-heading"><a class="alert-heading" href="profile.html?user=' + ntfcn[i] + '"</a>' + ntfcn[i] + '</h5>' + "<button class='btn btn-primary' onclick='self.location.href=\"chat.html?p=" + ntfcn[i] + "\"'>Chat betreten</button>"
                    nBox.appendChild(noti);
                    notified = false;
                }
                if (notified) {
                    var nBox = document.getElementById("notification");
                    var noti = document.createElement("div");
                    noti.setAttribute("role", "alert");
                    noti.setAttribute("id", "alert" + i);
                    noti.setAttribute("class", "alert alert-dark");
                    noti.innerHTML = 'Du hast noch keine Chats.';
                    nBox.appendChild(noti);
                }
            } else {
                var nBox = document.getElementById("notification");
                var noti = document.createElement("div");
                noti.setAttribute("class", "formular");
                noti.innerHTML = "Falsche oder fehlende Nutzerdaten.<br>Bitte melden Sie sich erneut an!<br><br><button class='btn btn-primary' onclick='self.location.href=\"login.html\"'>zurück zum Login</button>";
                noti.style.textAlign = "center";
                nBox.appendChild(noti);
                nBox.setAttribute("class", "");
                document.getElementById("sendmdiv").innerHTML = "";
            }
            console.log("fetch success");

        } catch (e) {
            console.error('fetch error', e);
            data = "fetch_error";
        }
    }

}

async function sendMessage() {
    var l_username = getCookie("username");
    var l_session = getCookie("session");
    var message = document.getElementById("messageSend").value;
    document.getElementById("messageSend").value = "";
    console.log(message);
    if (getQueryVariable("p") != "") {
        var fullurl = server_url + '/backend/index.php?request=sendMessage&username=' + l_username + "&session=" + l_session + "&partner=" + getQueryVariable("p") + "&message=" + message;
        try {
            let request = await fetch(fullurl, {
                method: "GET",
                dataType: "application/x-www-form-urlencoded",
            });

            data = await request.text();

            if (data == "success") {
                document.getElementById("sendmdiv").setAttribute("class", "alert alert-success")
                getChats();
                document.getElementById("sendmdiv").setAttribute("class", "alert alert-dark")
            } else {
                document.getElementById("sendmdiv").setAttribute("class", "alert alert-warning")
                document.getElementById("messageSend").value = message;
            }
        } catch (e) {
            console.error('fetch error', e);
            data = "fetch_error";
        }
    }
}


function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'file.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {

            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(xobj.responseText);

        }
    }
    xobj.send(null);

}

function emojisShortToHtml(text) {
    for (x in emjs) {
        if (text.includes(":" + x + ":")) {
            text = text.replace(":" + x + ":", String.fromCodePoint(parseInt(emjs[x], 16)));
        }
    }

    return text;
}



function emojisReplace(ms) {
    var x;
    for (x in emjs) {
        if (ms.value.includes(":" + x + ":")) {
            ms.value = ms.value.replace(":" + x + ":", String.fromCodePoint(parseInt(emjs[x], 16)));
        }
    }
}

function dropcalc() {

    //var drdw = [":joy:", ":thumbs_up:", ":smile:", ":grin:", ":smiley:", ":laughing:", ":smirk:", ":kissing:", ":rolling_eyes:"]; // Liste der Emoji-Codes, die im Dropdown angezeigt werden
    //var drdw = emjsX;

    var text = document.getElementById("messageSend").value
    var sout = [];
    var sn = text.split(" ");


    if (text.includes(":")) {
        for (var i = 0; i < drdw.length; i++) {
            if (drdw[i].includes(sn[sn.length - 1]) && sn[sn.length - 1].includes(":")) {
                if (!sout.includes(drdw[i])) {
                    sout.push(drdw[i]);
                }
            }
        }
    }

    document.getElementsByClassName("dropcontent")[0].innerHTML = "";
    for (var i = 0; i < sout.length; i++) {
        var newd = document.createElement("div");
        newd.setAttribute("id", "drdwel" + i);
        newd.setAttribute("class", "dropelement");
        newd.setAttribute("onclick", "dropselect(" + i + ")");
        newd.innerHTML = sout[i];
        document.getElementsByClassName("dropcontent")[0].append(newd);
    }
    if (sout.length == 0) {
        document.getElementsByClassName("dropcontent")[0].setAttribute("hidden", "true");
    } else {
        document.getElementsByClassName("dropcontent")[0].removeAttribute("hidden");
    }
}

function dropselect(num) {
    var text = document.getElementById("messageSend").value;
    var sn = text.split(" ");
    var selected = document.getElementById("drdwel" + num);
    sn[sn.length - 1] = selected.innerHTML;
    text = "";
    for (var i = 0; i < sn.length; i++) {
        text += sn[i] + " ";
    }
    document.getElementById("messageSend").value = text;
    dropcalc();
}
