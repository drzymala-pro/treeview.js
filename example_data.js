function getExampleData() {
  return [
    {
      "name": "DirectoryOne",
      "file": false,
      "fold": true,
      "list": [
        {"name": "SYSLOG_001.LOG", "file": true, "mark": false},
        {"name": "SYSLOG_002.LOG", "file": true, "mark": false},
        {"name": "SYSLOG_003.LOG", "file": true, "mark": false},
        {"name": "SYSLOG_004.LOG", "file": true, "mark": false},
        {"name": "SYSLOG_005.LOG", "file": true, "mark": false},
      ]
    },
    {
      "name": "DirectoryTwo",
      "file": false,
      "fold": false,
      "list": [
        {
          "name": "Subdirectory",
          "file": false,
          "fold": false,
          "list": [
            {
              "name": "More Deep",
              "file": false,
              "fold": false,
              "list": [
                {
                  "name": "Even Deeper",
                  "file": false,
                  "fold": false,
                  "list": [
                    {
                      "name": "The Deepest",
                      "file": false,
                      "fold": false,
                      "list": [
                        {"name": "very_deep_file_1.LOG", "file": true, "mark": true},
                        {"name": "very_deep_file_2.LOG", "file": true, "mark": false},
                        {"name": "very_deep_file_3.LOG", "file": true, "mark": true}
                      ]
                    },
                  ]
                },
              ]
            },
            {"name": "SYSLOG_201.LOG", "file": true, "mark": true},
            {"name": "SYSLOG_202.LOG", "file": true, "mark": false},
            {"name": "SYSLOG_203.LOG", "file": true, "mark": true}
          ]
        },
        {
          "name": "EmptySubdirectory",
          "file": false,
          "fold": false,
          "list": []
        },
        {"name": "SYSLOG_501.LOG", "file": true, "mark": false,},
        {"name": "SYSLOG_502.LOG", "file": true, "mark": false,},
        {"name": "SYSLOG_503.LOG", "file": true, "mark": false,},
        {"name": "SYSLOG_504.LOG", "file": true, "mark": false,},
        {"name": "SYSLOG_505.LOG", "file": true, "mark": false,},
      ]
    }
  ]
}
