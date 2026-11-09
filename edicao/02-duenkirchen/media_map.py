import os
HERE = os.path.dirname(os.path.abspath(__file__))
# film in-points (seconds) chosen from contact sheets; public-domain films:
# DC1-3 = Why We Fight: Divide and Conquer (1943); BOB = Why We Fight: Battle of Britain (1943); FB56 = War Dept Film Bulletin 56 (1940 footage)
VCLIPS = {
    'V02@forest_plane': ('DC2.mp4', 608), 'V02@hitler': ('DC1.mp4', 833.95), 'V02@victory_march': ('DC2.mp4', 748),
    'V02@panzer_column': ('DC3.mp4', 904), 'V03@bef_digging': ('BOB.mp4', 337.5), 'V03@ships': ('BOB.mp4', 77.5),
    'V02@hitler_generals': ('DC2.mp4', 200), 'V02@may10_attack': ('DC2.mp4', 700), 'V02@ardennes_column': ('DC3.mp4', 604),
    'V02@ww1_trenches': ('DC2.mp4', 64), 'V02@flak': ('DC3.mp4', 780), 'V02@broken_tanks': ('DC3.mp4', 896),
    'V01@stuka1': ('DC3.mp4', 473), 'V03@ships2': ('BOB.mp4', 400), 'V03@beach_lines': ('BOB.mp4', 340),
    'V03@little_ships': ('FB56.mp4', 1036), 'V01@stuka2': ('DC3.mp4', 84), 'V02@burning_harbour': ('DC3.mp4', 100),
    'V01@stuka3': ('DC3.mp4', 19), 'V02@panzer_attack': ('DC3.mp4', 628), 'V02@abandoned': ('BOB.mp4', 365.5),
    'V02@newsreel': ('BOB.mp4', 52), 'V03@churchill': ('BOB.mp4', 379.5), 'V03@uk_rebuild': ('BOB.mp4', 456),
    'V03@battle_of_britain': ('BOB.mp4', 86),
}
FIX = {'FB56.mp4': 'eq=contrast=1.7:brightness=-0.18:gamma=0.85,'}  # washed-out print
PHOTO_FALLBACK = {
    'F17_panzer_wald': 'V:DC3.mp4@608', 'F18_vormarsch': 'V:DC3.mp4@906', 'F16_somua_destroyed': 'V:DC3.mp4@897',
    'F19_sdkfz_funk': 'V:DC2.mp4@757', 'F21_pontoon_maas': 'V:DC3.mp4@893', 'F46_matilda': 'V:BOB.mp4@374',
    'F38_ju87': 'V:DC3.mp4@474', 'F40_calais_hafen': 'V:BOB.mp4@79', 'F42_strand_soldaten': 'V:FB56.mp4@1182',
    'F48_spitfire_he111': 'V:BOB.mp4@423', 'F47_hurricane_lille': 'V:BOB.mp4@427', 'F35_paris_arc': 'V:BOB.mp4@58',
    'F44_compiegne_waggon': 'V:BOB.mp4@44', 'F_dover_cliffs': 'V:BOB.mp4@398', 'WW1': 'V:DC2.mp4@72',
    'F15_prisoners_column': 'V:FB56.mp4@925', 'F29_felsennest_bunker': 'MAP:m00', 'F28_fhq_felsennest': 'V:DC2.mp4@205',
    'F27_hitler_lage': 'V:BOB.mp4@174', 'F30_hitler_kluge': 'V:DC1.mp4@835', 'F26_goering': 'V:DC2.mp4@374',
}
MAP_STILL = {'m01': f'{HERE}/storyboard/maps_exact/m01_lage_2.9.jpg', 'm00': f'{HERE}/storyboard/maps_exact/m00_flug_3.0.jpg'}
