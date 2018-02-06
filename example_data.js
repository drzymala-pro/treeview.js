function getExampleData() {
  return {
    "name": "Main folder",
    "fold": false,
    "list": [
      {
        "name": "DirectoryOne",
        "fold": true,
        "list": [
          {"name": "SYSLOG_001.LOG", "mark": false},
          {"name": "SYSLOG_002.LOG", "mark": false},
          {"name": "SYSLOG_003.LOG", "mark": false},
          {"name": "SYSLOG_004.LOG", "mark": false},
          {"name": "SYSLOG_005.LOG", "mark": false},
        ]
      },
      {
        "name": "DirectoryTwo",
        "fold": false,
        "list": [
          {
            "name": "Subdirectory",
            "fold": false,
            "list": [
              {
                "name": "More Deep",
                "fold": false,
                "list": [
                  {
                    "name": "Even Deeper",
                    "fold": false,
                    "list": [
                      {
                        "name": "The Deepest",
                        "fold": false,
                        "list": [
                          {"name": "very_deep_file_1.LOG", "mark": true},
                          {"name": "very_deep_file_2.LOG", "mark": false},
                          {"name": "very_deep_file_3.LOG", "mark": true}
                        ]
                      },
                    ]
                  },
                ]
              },
              {"name": "SYSLOG_201.LOG", "mark": true},
              {"name": "SYSLOG_202.LOG", "mark": false},
              {"name": "SYSLOG_203.LOG", "mark": true}
            ]
          },
          {
            "name": "EmptySubdirectory",
            "fold": false,
            "list": []
          },
          {"name": "SYSLOG_501.LOG", "mark": false,},
          {"name": "SYSLOG_502.LOG", "mark": false,},
          {"name": "SYSLOG_503.LOG", "mark": false,},
          {"name": "SYSLOG_504.LOG", "mark": false,},
          {"name": "SYSLOG_505.LOG", "mark": false,},
        ]
      }
    ]
  }
}
