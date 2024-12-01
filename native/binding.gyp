{
  "targets": [
    {
      "target_name": "native",
      "sources": [ "native.cc" ],
      "include_dirs" : [ "<!(node -e \"require('nan')\")", "../../../obs-studio/libobs" ],
      'conditions': [
        [
          'OS == "win"', {
            "defines": [ "NOMINMAX" ],
          }
        ]
      ]
    }
  ]
}
