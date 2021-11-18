const { app } = require("../app.js");
const moment = require("moment");

var lastscores_JP = {};

var lastscores_EN = {};
const EVENTID_EN = 23;
var EVENTSTART_EN = moment("2021-06-28 03:00:00+00");
var EVENTEND_EN = moment("2021-07-06 11:59:59+00");

app.post("/eventsubmit", async function (req, res) {
  db = req.db

  const eventData = await req.db.query(
    "select eventid, startdate, enddate from event order by id desc limit 1"
  ).then((data) => data.rows[0]);

  const EVENTID = eventData.eventid;
  const EVENTSTART = moment(eventData.startdate);
  const EVENTEND = moment(eventData.enddate);

  const lastscores = req.query.en ? lastscores_EN : lastscores_JP;
  function submit() {
    if (req.query.en) {
      lastscores_EN[req.body.rank] = Number(req.body.points);
    } else {
      lastscores_JP[req.body.rank] = Number(req.body.points);
    }
    req.db.query(
      "insert into " +
      (req.query.en ? "en_" : "") +
      "eventdata(eventid,rank,date,name,description,points) values($1,$2,$3,$4,$5,$6) returning *;",
      [
        req.body.eventid,
        req.body.rank,
        req.body.date
          ? req.body.date
          : req.body.fin
            ? moment(EVENTEND).add(5, "minutes").format("YYYY-MM-DD HH:mm:ssZ")
            : new Date(),
        req.body.name,
        req.body.description,
        req.body.points,
      ]
    )
      .then((data) => {
        if (data.rows.length > 0) {
          res.status(200).send("Submitted.");
        } else {
          res.status(500).send("Failed to submit.");
        }
      })
      .catch((err) => {
        res.status(500).send(`${err.message}`);
      });
  }

  //add to table.

  function FurtherTierIsOkay(tier, scores, points) {
    var tiers = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 50,
      100, 500, 1000, 2000, 5000, 10000, 20000, 30000, 50000,
    ];
    if (tier <= 1) {
      return true;
    } else {
      //Find the previous tier.
      var previousTier = -1;
      for (var i = 0; i < tiers.length; i++) {
        if (tiers[i] == tier) {
          previousTier = tiers[i - 1];
        }
      }
      if (previousTier == -1) {
        console.log("Something weird happened....");
        return false; //Something terrible happened.
      } else if (!scores[tier]) {
        return true; //It's okay since no score is submitted yet.
      } else {
        return points < scores[previousTier]; //If it's greater something's wrong...
      }
    }
  }

  function EndsWithZeroes(str) {
    var zeroCount = 0;
    var string = String(str);
    for (var i = 0; i < string.length; i++) {
      if (string[i] == "0") {
        zeroCount++;
      } else {
        zeroCount = 0;
      }
    }
    return zeroCount >= 2;
  }

  function ScoreIsSanitary(rank, name, description, points) {
    if (Number(rank) <= 20) {
      return true;
    } else {
      if (
        EndsWithZeroes(name) ||
        EndsWithZeroes(description) ||
        EndsWithZeroes(points)
      ) {
        return false;
      } else {
        return true;
      }
    }
  }

  //Try to update last scores.
  db.query(
    "select distinct on (rank) rank,eventid,date,name,description,points,difference from (select lead(points) over (partition by rank order by rank,date desc)-points difference,* from " +
    (req.query.en ? "en_" : "") +
    "eventdata where eventid=" +
    EVENTID +
    " order by rank,date desc)t order by rank,date desc"
  ).then((data) => {
    if (
      !lastscores[req.body.rank] ||
      /*FurtherTierIsOkay(req.body.rank,lastscores,req.body.points)&&*/ (lastscores[
        req.body.rank
      ] < req.body.points &&
        (req.body.fin ||
          ScoreIsSanitary(
            req.body.rank,
            req.body.name,
            req.body.description,
            req.body.points
          ))) /*||(lastscores[req.body.rank]<req.body.points
                        &&(FurtherTierIsOkay(req.body.rank,lastscores,req.body.points))*/
    ) {
      submit();
    } else {
      res.status(200).send("No update required.");
    }
    if (data.rows.length > 0) {
      data.rows.map((row) => {
        lastscores[row.rank] = row.points;
      });
    }
  });
});

app.get("/eventdata", function (req, res) {
  var eventinfo = [];
  db = req.db;
  db.query(
    "select * from " +
    (req.query.en ? "en_" : "") +
    "event order by id desc limit 1"
  )
    .then((data) => {
      eventinfo = data.rows;
      if (!req.query.event) {
        return db.query(
          "select distinct on (rank) rank,eventid,date,name,description,points,difference from (select lead(points) over (partition by rank order by rank,date desc)-points difference,* from " +
          (req.query.en ? "en_" : "") +
          "eventdata where eventid=$1 order by rank,date desc)t order by rank,date desc;",
          [
            moment(eventinfo[0].startdate).isBefore(moment())
              ? eventinfo[0].eventid
              : eventinfo[0].eventid - 1,
          ]
        );
      } else {
      }
    })
    .then((data) => {
      var finaldata = data.rows;
      var tiers = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        50, 100, 500, 1000, 2000, 5000, 10000, 20000, 30000, 50000,
      ];
      for (t of tiers) {
        //console.log(t)
        //if (finaldata[String(t)]===undefined) {finaldata[String(t)]={"rank":t,"eventid":eventinfo[0].eventid,"name":"","description":"","date":eventinfo[0].startdate,"points":0}}
        var found = false;
        for (i in finaldata) {
          //console.log(finaldata[i].rank)
          if (finaldata[i].rank === t) {
            found = true;
            break;
          }
        }
        if (!found) {
          finaldata = [
            ...finaldata,
            {
              rank: t,
              eventid: eventinfo[0].eventid,
              name: "",
              description: "",
              date: eventinfo[0].startdate,
              points: 0,
            },
          ];
        }
      }
      res.status(200).json(finaldata);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.get("/eventdata/t50", function (req, res) {
  var eventinfo = [];
  db = req.db
  db.query(
    "select * from " +
    (req.query.en ? "en_" : "") +
    "event order by id desc limit 1"
  )
    .then((data) => {
      eventinfo = data.rows;
      return db.query(
        "select distinct on (rank) rank,eventid,date,name,description,points,difference from (select lead(points) over (partition by rank order by rank,date desc)-points difference,* from " +
        (req.query.en ? "en_" : "") +
        "eventdata where rank>20 and eventid=$1 order by rank,date desc)t order by rank,date desc;",
        [
          moment(eventinfo[0].rank_end).isBefore(moment())
            ? eventinfo[0].eventid
            : eventinfo[0].eventid - 1,
        ]
      );
    })
    .then((data) => {
      return res.status(200).json(data.rows);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.get("/eventdata/t20", async function (req, res) {
  var eventinfo = [];
  var eventinfo_en = [];

  db = req.db

  const eventData = await req.db.query(
    "select eventid, startdate, enddate from event order by id desc limit 1"
  ).then((data) => data.rows[0]);

  const EVENTID = eventData.eventid;
  const EVENTSTART = moment(eventData.startdate);
  const EVENTEND = moment(eventData.enddate);

  if (req.query.date && req.query.rank) {
    db.query(
      "select * from " +
      (req.query.en ? "en_" : "") +
      "eventdata where date<=$1 and rank=$2 and eventid=$3 order by date desc limit 1;",
      [req.query.date, req.query.rank, req.query.eventid]
    )
      .then((data) => {
        res.status(200).json(data.rows);
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  } else if (req.query.luminous) {
    db.query(
      "select * from " +
      (req.query.en ? "en_" : "") +
      "eventdata where (date>='2021-02-17 23:36:16.383+00' and date<'2021-02-19 15:35:16.716+00' and rank=12) or (date>='2021-02-19 15:35:16.716+00' and rank=11) and eventid=10 order by id asc;"
    )
      .then((data) => {
        res.status(200).json(data.rows);
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  } else if (req.query.all && req.query.event) {
    db.query(
      "select * from (select lag(points) over (partition by rank order by date asc)-points difference,rank,eventid,date,name,points from " +
      (req.query.en ? "en_" : "") +
      "eventdata where eventid=$1 order by date asc)t",
      [req.query.event]
    )
      .then((data) => {
        res.status(200).json(data.rows);
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  } else if (req.query.tier && req.query.event) {
    db.query(
      "select * from (select lag(points) over (partition by rank order by date asc)-points difference,rank,eventid,date,name,points from " +
      (req.query.en ? "en_" : "") +
      "eventdata where eventid=$1 and rank=$2 order by date desc)t",
      [req.query.event, req.query.tier]
    )
      .then((data) => {
        res.status(200).json(data.rows);
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  } else if (req.query.chart) {
    function RandomQuestion() {
      var value = Math.random();
      if (value <= 0.7) {
        return "???";
      } else if (value <= 0.9) {
        return "Miyu";
      } else if (value <= 0.95) {
        return "Muni";
      } else {
        return "MuniMuni";
      }
    }
    if (
      req.query.event ||
      moment().diff(lastCachedDate, "minutes") >= 1 ||
      (req.query.force && moment().diff(lastCachedDate, "seconds") >= 10)
    ) {
      chartData = {};
      predictionChartData = {};
      diffData = [];
      db.query(
        "select * from " +
        (req.query.en ? "en_" : "") +
        "event order by id desc limit 1"
      )
        .then((data) => {
          eventinfo = data.rows;
          return db.query(
            "select * from (select lag(points) over (partition by rank order by date asc)-points difference,rank,eventid,date,name,points from " +
            (req.query.en ? "en_" : "") +
            "eventdata where eventid=$1 order by date asc)t",
            [
              req.query.event
                ? req.query.event
                : moment(eventinfo[0].rank_end).isBefore(moment())
                  ? eventinfo[0].eventid
                  : eventinfo[0].eventid - 1,
            ]
          );
        })
        .then((data) => {
          if (data && data.rows && data.rows.length > 0) {
            data.rows.map((obj) => {
              if (req.query.en) {
                if (en_chartData[obj.rank]) {
                  en_chartData[obj.rank] = [...en_chartData[obj.rank], obj];
                } else {
                  en_chartData[obj.rank] = [obj];
                }
              } else {
                if (chartData[obj.rank]) {
                  chartData[obj.rank] = [...chartData[obj.rank], obj];
                } else {
                  chartData[obj.rank] = [obj];
                }
              }
            });
            SetupPredictionModel(EVENTSTART);
            var tiers = [
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
              20, 50, 100, 500, 1000, 2000, 5000, 10000, 20000, 30000, 50000,
            ];
            if (req.query.en) {
              for (t of tiers) {
                CreatePrediction(1, t, req.query.en, EVENTSTART, EVENTSTART_EN, EVENTEND, EVENTEND_EN);
                var est = GetEstimate(t, req.query.en);
                var temprate = 0;
                if (en_chartData[t]) {
                  temprate =
                    t <= 20
                      ? en_chartData[t]
                        ? Math.ceil(GetRate(t, req.query.en))
                        : undefined
                      : Math.ceil(
                        GetRank(t, req.query.en) /
                        (moment(
                          en_chartData[t][en_chartData[t].length - 1].date
                        ).diff(eventStartEn, "minutes") /
                          60)
                      );
                }
                var tempname = "";
                if (
                  en_chartData[t] &&
                  en_chartData[t][en_chartData[t].length - 1] &&
                  en_chartData[t][en_chartData[t].length - 1].name
                ) {
                  tempname = en_chartData[t][en_chartData[t].length - 1].name;
                }
                var tempdesc = "";
                if (
                  en_chartData[t] &&
                  en_chartData[t][en_chartData[t].length - 1] &&
                  en_chartData[t][en_chartData[t].length - 1].description
                ) {
                  tempdesc =
                    en_chartData[t][en_chartData[t].length - 1].description;
                }
                en_tableValues[t] = {
                  points: GetRank(t, req.query.en),
                  lastUpdate: GetTime(t, req.query.en),
                  lastUpdateColor: GetUpdateColor(t, req.query.en),
                  rate: temprate ? temprate : 0,
                  count: GetPointCount(t, req.query.en),
                  name: tempname,
                  description: tempdesc,
                  estimate: Number.isInteger(est) ? Math.ceil(est) : est,
                  prediction:
                    en_predictionChartData[t] && moment().isBefore(EVENTEND_en)
                      ? en_predictionChartData[t][
                        en_predictionChartData[t].length - 1
                      ].y
                      : RandomQuestion(),
                };
              }
              lastCachedDate = moment();
              res.status(200).send({
                predictionData: en_predictionChartData,
                statistics: tableValues,
              });
            } else {
              for (t of tiers) {
                CreatePrediction(1, t, req.query.en, EVENTSTART, EVENTSTART_EN, EVENTEND, EVENTEND_EN);
                var est = GetEstimate(t, req.query.en);
                var temprate = 0;
                if (chartData[t]) {
                  temprate =
                    t <= 20
                      ? chartData[t]
                        ? Math.ceil(GetRate(t))
                        : undefined
                      : Math.ceil(
                        GetRank(t) /
                        (moment(
                          chartData[t][chartData[t].length - 1].date
                        ).diff(EVENTSTART, "minutes") /
                          60)
                      );
                }
                var tempname = "";
                if (
                  chartData[t] &&
                  chartData[t][chartData[t].length - 1] &&
                  chartData[t][chartData[t].length - 1].name
                ) {
                  tempname = chartData[t][chartData[t].length - 1].name;
                }
                var tempdesc = "";
                if (
                  chartData[t] &&
                  chartData[t][chartData[t].length - 1] &&
                  chartData[t][chartData[t].length - 1].description
                ) {
                  tempdesc = chartData[t][chartData[t].length - 1].description;
                }
                tableValues[t] = {
                  points: GetRank(t),
                  lastUpdate: GetTime(t),
                  lastUpdateColor: GetUpdateColor(t),
                  rate: temprate ? temprate : 0,
                  count: GetPointCount(t),
                  name: tempname,
                  description: tempdesc,
                  estimate: Number.isInteger(est) ? Math.ceil(est) : est,
                  prediction:
                    predictionChartData[t] && moment().isBefore(EVENTEND)
                      ? predictionChartData[t][
                        predictionChartData[t].length - 1
                      ].y
                      : RandomQuestion(),
                };
              }
              lastCachedDate = moment();
              res.status(200).send({
                predictionData: predictionChartData,
                statistics: tableValues,
              });
            }
          } else {
            if (req.query.en) {
              res.status(200).send({
                predictionData: en_predictionChartData,
                statistics: en_tableValues,
              });
            } else {
              res.status(200).send({
                predictionData: predictionChartData,
                statistics: tableValues,
              });
            }
          }
        })
        .catch((err) => {
          res.status(500).send(err.message);
        });
    } else {
      if (req.query.en) {
        res.status(200).send({
          predictionData: en_predictionChartData,
          statistics: en_tableValues,
        });
      } else {
        res.status(200).send({
          predictionData: predictionChartData,
          statistics: tableValues,
        });
      }
    }
  } else {
    db.query("select * from event order by id desc limit 1")
      .then((data) => {
        eventinfo = data.rows;
        return db.query(
          "select distinct on (rank) rank,eventid,date,name,description,points,difference from (select lead(points) over (partition by rank order by rank,date desc)-points difference,* from " +
          (req.query.en ? "en_" : "") +
          "eventdata where rank<=20 and eventid=$1 order by rank,date desc)t order by rank,date desc;",
          [
            moment(eventinfo[0].rank_end).isBefore(moment())
              ? eventinfo[0].eventid
              : eventinfo[0].eventid - 1,
          ]
        );
      })
      .then((data) => {
        var finaldata = data.rows;
        var tiers = [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        ];
        //RunRankingUpdate()
        for (t of tiers) {
          //console.log(t)
          //if (finaldata[String(t)]===undefined) {finaldata[String(t)]={"rank":t,"eventid":eventinfo[0].eventid,"name":"","description":"","date":eventinfo[0].startdate,"points":0}}
          var found = false;
          for (i in finaldata) {
            //console.log(finaldata[i].rank)
            if (finaldata[i].rank === t) {
              found = true;
              var temprate = chartData[t] ? Math.ceil(GetRate(t)) : undefined;
              if (!temprate) {
                finaldata[i].rate = "???";
              } else {
                finaldata[i].rate = temprate;
              }
              //finaldata[i].name="Muni";
              /*if (rankings[t]) {
                          finaldata[i].name=rankings[t]
                      }*/
              break;
            }
          }
          if (!found) {
            finaldata = [
              ...finaldata,
              {
                rate: 0,
                rank: t,
                eventid: eventinfo[0].eventid,
                name: "",
                description: "",
                date: eventinfo[0].startdate,
                points: 0,
              },
            ];
          }
        }
        if (req.query.maxspeed) {
          res.status(200).json([...finaldata, { maxspeed: MAXSPEED }]);
        } else {
          res.status(200).json(finaldata);
        }
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  }
});

app.get("/ev", function (req, res) {
  db = req.db
  if (req.query.all) {
    db.query(
      "select * from " + (req.query.en ? "en_" : "") + "event order by id desc;"
    )
      .then((data) => {
        res.status(200).send(data.rows);
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  } else {
    db.query(
      "select * from " +
      (req.query.en ? "en_" : "") +
      "event order by id desc limit 1;"
    )
      .then((data) => {
        res.status(200).send(data.rows[0]);
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  }
});

var chartData = {};
var predictionChartData = {};

var diffData = [];

var en_chartData = {};
var en_predictionChartData = {};

var en_diffData = [];

const PREDICTIONS = true;

const en_PREDICTIONS = true;

var lastCachedDate = moment().add(-1, "hour");

var en_lastCachedDate = moment().add(-1, "hour");

const nyoomfactor = {
  //Percentage of original speed to use when nyoom'ing
  1: 1.0,
  2: 1.0,
  3: 1.0,
  4: 1.0,
  5: 1.0,
  6: 1.0,
  7: 1.0,
  8: 1.0,
  9: 1.0,
  10: 1.0,
  11: 1.0,
  12: 0.9,
  13: 0.7,
  14: 0.5,
  15: 0.3,
  16: 0.3,
  17: 0.3,
  18: 0.3,
  19: 0.3,
  20: 0.3,
  50: 0.81,
  100: 0.76,
  500: 0.28,
  1000: 0.24,
  2000: 0.09,
  5000: 0.07,
  10000: 0.04,
  20000: 0.02,
};

const slowdownFactor = {
  //Percentage of slowdown per hour.
  1: 0.00001,
  2: 0.00003,
  3: 0.00003,
  4: 0.00005,
  5: 0.00005,
  6: 0.00005,
  7: 0.00005,
  8: 0.00005,
  9: 0.00005,
  10: 0.00005,
  11: 0.00005,
  12: 0.00006,
  13: 0.00007,
  14: 0.00008,
  15: 0.00009,
  16: 0.0001,
  17: 0.0001,
  18: 0.0001,
  19: 0.0001,
  20: 0.0001,
  50: 0.0002,
  100: 0.0003,
  500: 0.0004,
  1000: 0.0005,
  2000: 0.0005,
  5000: 0.0005,
  10000: 0.0005,
  20000: 0.0005,
};

var MAXSPEED = 0;

function SetupPredictionModel(eventStart) {
  if (chartData["1"] && chartData["1"].length > 400) {
    MAXSPEED = Math.floor(
      chartData["1"][400].points /
      (moment(chartData["1"][400].date).diff(eventStart, "minutes") / 60)
    );
  } else if (chartData["1"] && chartData["1"].length > 0) {
    MAXSPEED = Math.floor(
      chartData["1"][chartData["1"].length - 1].points /
      (moment(chartData["1"][chartData["1"].length - 1].date).diff(
        eventStart,
        "minutes"
      ) /
        60)
    );
  } else {
    MAXSPEED = 0;
  }
  if (en_chartData["1"] && en_chartData["1"].length > 400) {
    MAXSPEED = Math.floor(
      en_chartData["1"][400].points /
      (moment(en_chartData["1"][400].date).diff(eventStart, "minutes") / 60)
    );
  } else if (en_chartData["1"] && en_chartData["1"].length > 0) {
    MAXSPEED = Math.floor(
      en_chartData["1"][en_chartData["1"].length - 1].points /
      (moment(en_chartData["1"][en_chartData["1"].length - 1].date).diff(
        eventStart,
        "minutes"
      ) /
        60)
    );
  } else {
    MAXSPEED = 0;
  }
}
const RATEDURATION = 2; //In hours. How much EP/hr is shown.

function GetRate(rank, en, eventStart) {
  if (en) {
    if (en_chartData[rank].length > 2) {
      var lastpoint = en_chartData[rank][en_chartData[rank].length - 1];
      for (var i = en_chartData[rank].length - 1; i >= 0; i--) {
        var diff = moment().diff(en_chartData[rank][i].date, "hours");
        if (diff >= RATEDURATION) {
          break;
        } else {
          lastpoint = en_chartData[rank][i];
        }
      }
      var timediff = moment(
        en_chartData[rank][en_chartData[rank].length - 1].date
      ).diff(moment(lastpoint.date), "minutes");
      if (timediff < 120) {
        if (lastpoint === en_chartData[rank][en_chartData[rank].length - 1]) {
          return "???";
        } else
          return (
            (en_chartData[rank][en_chartData[rank].length - 1].points -
              lastpoint.points) /
            RATEDURATION
          );
      } else {
        return Math.ceil(
          (en_chartData[rank][en_chartData[rank].length - 1].points -
            lastpoint.points) /
          (moment(
            en_chartData[rank][en_chartData[rank].length - 1].date
          ).diff(moment(lastpoint.date), "minutes") /
            60)
        );
      }
    } else {
      if (en_chartData[rank].length > 0) {
        var startPoint = en_chartData[rank][en_chartData[rank].length - 1];
        return Math.ceil(
          GetRank(rank) /
          (moment(startPoint.date).diff(eventStart, "minutes") / 60)
        );
      } else {
        return 0;
      }
    }
  } else {
    if (chartData[rank].length > 2) {
      var lastpoint = chartData[rank][chartData[rank].length - 1];
      for (var i = chartData[rank].length - 1; i >= 0; i--) {
        var diff = moment().diff(chartData[rank][i].date, "hours");
        if (diff >= RATEDURATION) {
          break;
        } else {
          lastpoint = chartData[rank][i];
        }
      }
      var timediff = moment(
        chartData[rank][chartData[rank].length - 1].date
      ).diff(moment(lastpoint.date), "minutes");
      if (timediff < 120) {
        if (lastpoint === chartData[rank][chartData[rank].length - 1]) {
          return "???";
        } else
          return (
            (chartData[rank][chartData[rank].length - 1].points -
              lastpoint.points) /
            RATEDURATION
          );
      } else {
        return Math.ceil(
          (chartData[rank][chartData[rank].length - 1].points -
            lastpoint.points) /
          (moment(chartData[rank][chartData[rank].length - 1].date).diff(
            moment(lastpoint.date),
            "minutes"
          ) /
            60)
        );
      }
    } else {
      if (chartData[rank].length > 0) {
        var startPoint = chartData[rank][chartData[rank].length - 1];
        return Math.ceil(
          GetRank(rank) /
          (moment(startPoint.date).diff(eventStart, "minutes") / 60)
        );
      } else {
        return 0;
      }
    }
  }
}

function GetPointCount(rank, en) {
  var pointCount = 1;
  if (en) {
    if (!en_chartData[rank]) {
      return pointCount;
    }
    if (en_chartData[rank].length > 2) {
      var lastpoint = en_chartData[rank][en_chartData[rank].length - 1];
      for (var i = en_chartData[rank].length - 1; i >= 0; i--) {
        var diff = moment().diff(en_chartData[rank][i].date, "hours");
        if (diff >= RATEDURATION) {
          break;
        } else {
          lastpoint = en_chartData[rank][i];
          pointCount++;
        }
      }
      return pointCount;
    } else {
      if (en_chartData[rank].length > 0) {
        return en_chartData[rank].length;
      } else {
        return pointCount;
      }
    }
  } else {
    if (!chartData[rank]) {
      return pointCount;
    }
    if (chartData[rank].length > 2) {
      var lastpoint = chartData[rank][chartData[rank].length - 1];
      for (var i = chartData[rank].length - 1; i >= 0; i--) {
        var diff = moment().diff(chartData[rank][i].date, "hours");
        if (diff >= RATEDURATION) {
          break;
        } else {
          lastpoint = chartData[rank][i];
          pointCount++;
        }
      }
      return pointCount;
    } else {
      if (chartData[rank].length > 0) {
        return chartData[rank].length;
      } else {
        return pointCount;
      }
    }
  }
}

function CreatePrediction(precision, rank, en, eventStart, eventEnd, eventStartEn, eventEndEn) {
  if (en) {
    if (!en_chartData[rank]) {
      return [];
    }
    var startPoint = en_chartData[rank][en_chartData[rank].length - 1];
    if (rank <= 20) {
      startPoint = { points: startPoint.points, date: moment() };
    }
    var startTime = moment(startPoint.date);
    if (
      en_PREDICTIONS &&
      startTime.diff(eventStartEn, "hours") > 36 &&
      moment(startPoint.date).diff(eventStartEn, "hours") >= 36
    ) {
      //console.log(MAXSPEED)
      //Precision is in hours. 1 is default
      var finalChart = [
        {
          y: en_chartData[rank][en_chartData[rank].length - 1].points,
          x: en_chartData[rank][en_chartData[rank].length - 1].date,
        },
      ];
      //Start from the time of the last reported rank.
      var myPoints = startPoint.points;
      var pointSpeed = Math.ceil(
        GetRank(rank, en) /
        (moment(startPoint.date).diff(eventStartEn, "minutes") / 60)
      );
      var speedGoal = MAXSPEED * nyoomfactor[rank];
      while (startTime < EVENTEND_en) {
        startTime.add(precision, "hours");
        myPoints += Math.floor(pointSpeed);
        if (EVENTEND_en.diff(startTime, "hours") > 11) {
          pointSpeed -=
            pointSpeed *
            (slowdownFactor[rank] * 10) /*CONSTANT for adjustment*/;
        } else {
          pointSpeed = Math.max(
            GetRank(rank, en) /
            (moment(startPoint.date).diff(eventStartEn, "minutes") / 60),
            Math.min(
              (12 - EVENTEND_en.diff(startTime, "hours")) * (speedGoal / 5),
              speedGoal
            )
          );
          //pointSpeed+=(speedGoal-pointSpeed) //Increase towards final goal.
          //console.log(pointSpeed)
        }
        finalChart = [
          ...finalChart,
          {
            y: Number.isInteger(myPoints) ? myPoints : "???",
            x: moment(startTime),
          },
        ];
      }
      predictionen_chartData[rank] = finalChart;
      return finalChart;
    } else if (
      PREDICTIONS_en &&
      startTime.diff(eventStartEn, "hours") > 24 &&
      moment(startPoint.date).diff(eventStartEn, "hours") >= 24
    ) {
      //console.log(MAXSPEED)
      //Precision is in hours. 1 is default
      var finalChart = [
        {
          y: en_chartData[rank][en_chartData[rank].length - 1].points,
          x: en_chartData[rank][en_chartData[rank].length - 1].date,
        },
      ];
      //Start from the time of the last reported rank.
      var myPoints = startPoint.points;
      var pointSpeed = GetRate(rank, en);
      var speedGoal = MAXSPEED * nyoomfactor[rank];
      while (startTime < EVENTEND_en) {
        startTime.add(precision, "hours");
        myPoints += Math.floor(pointSpeed);
        if (EVENTEND_en.diff(startTime, "hours") > 11) {
          pointSpeed -=
            pointSpeed *
            (slowdownFactor[rank] * 10) /*CONSTANT for adjustment*/;
        } else {
          pointSpeed = Math.max(
            GetRank(rank, en) /
            (moment(startPoint.date).diff(eventStart, "minutes") / 60),
            Math.min(
              (12 - EVENTEND_en.diff(startTime, "hours")) * (speedGoal / 5),
              speedGoal
            )
          );
          //pointSpeed+=(speedGoal-pointSpeed) //Increase towards final goal.
          //console.log(pointSpeed)
        }
        finalChart = [
          ...finalChart,
          {
            y: Number.isInteger(myPoints) ? myPoints : "???",
            x: moment(startTime),
          },
        ];
      }
      en_predictionChartData[rank] = finalChart;
      return finalChart;
    } else {
      return [];
    }
  } else {
    if (!chartData[rank]) {
      return [];
    }
    var startPoint = chartData[rank][chartData[rank].length - 1];
    if (rank <= 20) {
      startPoint = { points: startPoint.points, date: moment() };
    }
    var startTime = moment(startPoint.date);
    if (
      PREDICTIONS &&
      startTime.diff(eventStart, "hours") > 36 &&
      moment(startPoint.date).diff(eventStart, "hours") >= 36
    ) {
      //console.log(MAXSPEED)
      //Precision is in hours. 1 is default
      var finalChart = [
        {
          y: chartData[rank][chartData[rank].length - 1].points,
          x: chartData[rank][chartData[rank].length - 1].date,
        },
      ];
      //Start from the time of the last reported rank.
      var myPoints = startPoint.points;
      var pointSpeed = Math.ceil(
        GetRank(rank) /
        (moment(startPoint.date).diff(eventStart, "minutes") / 60)
      );
      var speedGoal = MAXSPEED * nyoomfactor[rank];
      while (startTime < EVENTEND) {
        startTime.add(precision, "hours");
        myPoints += Math.floor(pointSpeed);
        if (EVENTEND.diff(startTime, "hours") > 11) {
          pointSpeed -=
            pointSpeed *
            (slowdownFactor[rank] * 10) /*CONSTANT for adjustment*/;
        } else {
          pointSpeed = Math.max(
            GetRank(rank) /
            (moment(startPoint.date).diff(eventStart, "minutes") / 60),
            Math.min(
              (12 - EVENTEND.diff(startTime, "hours")) * (speedGoal / 5),
              speedGoal
            )
          );
          //pointSpeed+=(speedGoal-pointSpeed) //Increase towards final goal.
          //console.log(pointSpeed)
        }
        finalChart = [
          ...finalChart,
          {
            y: Number.isInteger(myPoints) ? myPoints : "???",
            x: moment(startTime),
          },
        ];
      }
      predictionChartData[rank] = finalChart;
      return finalChart;
    } else if (
      PREDICTIONS &&
      startTime.diff(eventStart, "hours") > 24 &&
      moment(startPoint.date).diff(eventStart, "hours") >= 24
    ) {
      //console.log(MAXSPEED)
      //Precision is in hours. 1 is default
      var finalChart = [
        {
          y: chartData[rank][chartData[rank].length - 1].points,
          x: chartData[rank][chartData[rank].length - 1].date,
        },
      ];
      //Start from the time of the last reported rank.
      var myPoints = startPoint.points;
      var pointSpeed = GetRate(rank);
      var speedGoal = MAXSPEED * nyoomfactor[rank];
      while (startTime < EVENTEND) {
        startTime.add(precision, "hours");
        myPoints += Math.floor(pointSpeed);
        if (EVENTEND.diff(startTime, "hours") > 11) {
          pointSpeed -=
            pointSpeed *
            (slowdownFactor[rank] * 10) /*CONSTANT for adjustment*/;
        } else {
          pointSpeed = Math.max(
            GetRank(rank) /
            (moment(startPoint.date).diff(eventStart, "minutes") / 60),
            Math.min(
              (12 - EVENTEND.diff(startTime, "hours")) * (speedGoal / 5),
              speedGoal
            )
          );
          //pointSpeed+=(speedGoal-pointSpeed) //Increase towards final goal.
          //console.log(pointSpeed)
        }
        finalChart = [
          ...finalChart,
          {
            y: Number.isInteger(myPoints) ? myPoints : "???",
            x: moment(startTime),
          },
        ];
      }
      predictionChartData[rank] = finalChart;
      return finalChart;
    } else {
      return [];
    }
  }
}

function numberWithCommas(x) {
  if (Number.isInteger(x)) {
    var num_parts = x.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  } else {
    return x;
  }
}

function ChartData(rank, en, eventStart, eventEnd) {
  if (en) {
    if (!en_chartData[rank]) {
      return [{ x: 0, y: 0 }];
    }
    if (rank <= 20) {
      return [
        ...en_chartData[rank].map((data) => {
          return { x: data.date, y: data.points };
        }),
        {
          x: moment().isBefore(eventEnd) ? moment() : eventEnd,
          y: en_chartData[rank][en_chartData[rank].length - 1].points,
        },
      ];
    } else {
      return [
        { x: eventStartEn, y: 0 },
        ...en_chartData[rank].map((data) => {
          return { x: data.date, y: data.points };
        }),
      ];
    }
  } else {
    if (!chartData[rank]) {
      return [{ x: 0, y: 0 }];
    }
    if (rank <= 20) {
      return [
        ...chartData[rank].map((data) => {
          return { x: data.date, y: data.points };
        }),
        {
          x: moment().isBefore(eventEnd) ? moment() : eventEnd,
          y: chartData[rank][chartData[rank].length - 1].points,
        },
      ];
    } else {
      return [
        { x: eventStart, y: 0 },
        ...chartData[rank].map((data) => {
          return { x: data.date, y: data.points };
        }),
      ];
    }
  }
}

function GetRank(rank, en) {
  if (en) {
    if (en_chartData[rank]) {
      return en_chartData[rank][en_chartData[rank].length - 1].points;
    } else {
      return "???";
    }
  } else {
    if (chartData[rank]) {
      return chartData[rank][chartData[rank].length - 1].points;
    } else {
      return "???";
    }
  }
}

function GetEstimate(rank, en) {
  if (en) {
    if (en_predictionChartData[rank]) {
      var currentEstimate = 0;
      if (
        rank > 20 &&
        moment().diff(
          moment(en_chartData[rank][en_chartData[rank].length - 1].date),
          "hours"
        ) > 0.5
      ) {
        for (var i = en_predictionChartData[rank].length - 1; i >= 0; i--) {
          if (moment(en_predictionChartData[rank][i].x).isAfter(moment())) {
            currentEstimate = en_predictionChartData[rank][i].y;
          } else {
            break;
          }
        }

        return currentEstimate;
      } else {
        if (rank > 20) {
          return GetRank(rank, en);
        } else {
          return "---";
        }
      }
    } else {
      return "???";
    }
  } else {
    if (predictionChartData[rank]) {
      var currentEstimate = 0;
      if (
        rank > 20 &&
        moment().diff(
          moment(chartData[rank][chartData[rank].length - 1].date),
          "hours"
        ) > 0.5
      ) {
        for (var i = predictionChartData[rank].length - 1; i >= 0; i--) {
          if (moment(predictionChartData[rank][i].x).isAfter(moment())) {
            currentEstimate = predictionChartData[rank][i].y;
          } else {
            break;
          }
        }

        return currentEstimate;
      } else {
        if (rank > 20) {
          return GetRank(rank);
        } else {
          return "---";
        }
      }
    } else {
      return "???";
    }
  }
}

function GetTime(rank, en) {
  if (en) {
    if (en_chartData[rank]) {
      return moment(
        en_chartData[rank][en_chartData[rank].length - 1].date
      ).fromNow();
    } else {
      return "";
    }
  } else {
    if (chartData[rank]) {
      return moment(chartData[rank][chartData[rank].length - 1].date).fromNow();
    } else {
      return "";
    }
  }
}
function GetUpdateColor(rank, en) {
  if (en) {
    if (en_chartData[rank]) {
      return (
        "rgba(255," +
        Math.max(
          255 -
          moment().diff(
            moment(en_chartData[rank][en_chartData[rank].length - 1].date),
            "hours"
          ) *
          3,
          0
        ) +
        "," +
        Math.max(
          255 -
          moment().diff(
            moment(en_chartData[rank][en_chartData[rank].length - 1].date),
            "hours"
          ) *
          3,
          0
        ) +
        ",1)"
      );
    } else {
      return "";
    }
  } else {
    if (chartData[rank]) {
      return (
        "rgba(255," +
        Math.max(
          255 -
          moment().diff(
            moment(chartData[rank][chartData[rank].length - 1].date),
            "hours"
          ) *
          3,
          0
        ) +
        "," +
        Math.max(
          255 -
          moment().diff(
            moment(chartData[rank][chartData[rank].length - 1].date),
            "hours"
          ) *
          3,
          0
        ) +
        ",1)"
      );
    } else {
      return "";
    }
  }
}

var tableValues = {};
var en_tableValues = {};

var rankings = {
  1: "Maho",
  2: "Shinobu",
  3: "Muni",
  4: "Rei",
  5: "Yuka",
  6: "Kyoko",
  7: "Esoran",
  8: "Rinku",
  9: "Ibuki",
  10: "Esora",
  11: "Noa",
  12: "Saki",
  13: "Towa",
  14: "Rika",
  15: "Aoi",
  16: "Kurumi",
  17: "Saori",
  18: "Hiiro",
  19: "Michiru",
  20: "Tsubaki",
};

var lastRankingUpdate = moment();

var notPlaying = [
  "Dalia",
  "Marika",
  "Nyochio",
  "Nagisa",
  "Miyu",
  "Haruna",
  "Miiko",
  "Airi",
  "Mana",
  "Shano",
  "Touka",
];

function RunRankingUpdate() {
  if (moment().diff(lastRankingUpdate, "minutes") >= 1) {
    for (var i = 0; i < 20; i++) {
      //Possibility to switch two positions.
      var swap = false;
      if (i == 0) {
        if (Math.random() <= 0.01) {
          swap = true;
        }
      } else if (Math.random() <= 0.05) {
        swap = true;
      }
      if (swap) {
        if (i < 19) {
          var previousName = rankings[i + 1];
          var newName = rankings[i + 2];
          rankings[i + 1] = newName;
          rankings[i + 2] = previousName;
        } else {
          //Bring in a new name, swap out the old.
          var previousName = rankings[i + 1];
          var newRandomSlot = Math.floor(Math.random() * notPlaying.length);
          var newName = notPlaying[newRandomSlot];
          rankings[i + 1] = newName;
          notPlaying[newRandomSlot] = previousName;
        }
      }
    }
    lastRankingUpdate = moment();
  }
}