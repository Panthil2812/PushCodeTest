const fs = require("fs");
const period_1 = async (start, end) => {
  //   let pro = [0, 0, 0, 0];
  const sh_m = start.getHours() + start.getMinutes() / 100;
  const eh_m = end.getHours() + end.getMinutes() / 100;

  if (sh_m >= 5 && sh_m < 12) {
    // Period 1
    if (eh_m < 12) {
      return [eh_m - sh_m, 0, 0, 0];
    } else if (eh_m < 18) {
      return [8, eh_m - sh_m, 0, 0];
    } else if (eh_m < 23) {
      return [12 - sh_m, 6, 23 - eh_m, 0];
    } else if (eh_m <= 23.59) {
      return [12 - sh_m, 6, 5, 23.59 - eh_m];
    }
  } else if (sh_m >= 12 && sh_m < 18) {
    //Period 1 & 2
    if (eh_m < 18) {
      return [0, eh_m - sh_m, 0, 0];
    } else if (eh_m < 23) {
      return [0, 18 - sh_m, 23 - eh_m, 0];
    } else if (eh_m <= 23.59) {
      return [0, 18 - sh_m, 5, 23.59 - eh_m];
    }
  } else if (sh_m >= 18 && sh_m < 23) {
    // Period 3
    if (eh_m < 23) {
      return [0, 0, eh_m - sh_m, 0];
    } else if (eh_m <= 23.59) {
      return [0, 0, 23.59 - sh_m, 23.59 - eh_m];
    }
  }
};
const period_2 = async (start, end) => {
  const sh_m = start.getHours() + start.getMinutes() / 100;
  const eh_m = end.getHours() + end.getMinutes() / 100;
  //same day
  if (sh_m >= 0 && sh_m < 5) {
    if (eh_m < 5) {
      return [0, 0, 0, eh_m - sh_m];
    } else if (eh_m < 12) {
      return [eh_m - 5, 0, 0, 5];
    } else if (eh_m < 18) {
      return [7, eh_m - 18, 0, 5];
    } else if (eh_m < 23) {
      return [7, 6, eh_m - 18, 5];
    } else if (eh_m <= 23.59) {
      return [7, 6, 5, eh_m - 18];
    }
  }
};
const floor_num = (oppo) => {
  return oppo.toFixed(2);
};

const convertTime = async (arr) => {
  if (arr.length > 0) {
    let arr_ans = [];
    for (const clock of arr) {
      const start = new Date(clock.clock_in_datetime);
      const end = new Date(clock.clock_out_datetime);
      console.log(start, end);
      if (start.getDate() === end.getDate()) {
        const fff = await period_1(start, end);
        const total = floor_num(fff[0] + fff[1] + fff[2] + fff[3]);
        arr_ans.push({
          total: total,
          labour_by_time_period: {
            period1: floor_num(fff[0]),
            period2: floor_num(fff[1]),
            period3: floor_num(fff[2]),
            period4: floor_num(fff[3]),
          },
          date:
            start.getFullYear() +
            "-" +
            (start.getMonth() + 1) +
            "-" +
            start.getDate(),
        });
      } else {
        console.log("not same date");
        start1 =
          start.getFullYear() +
          "-" +
          ("0" + (start.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + start.getDate()).slice(-2) +
          " " +
          ("0" + start.getHours()).slice(-2) +
          ":" +
          ("0" + start.getMinutes()).slice(-2) +
          ":" +
          ("0" + start.getSeconds()).slice(-2);
        start2 =
          start.getFullYear() +
          "-" +
          ("0" + (start.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + start.getDate()).slice(-2) +
          " " +
          ("0" + 23).slice(-2) +
          ":" +
          ("0" + 59).slice(-2) +
          ":" +
          ("0" + 59).slice(-2);
        end2 =
          end.getFullYear() +
          "-" +
          ("0" + (end.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + end.getDate()).slice(-2) +
          " " +
          ("0" + end.getHours()).slice(-2) +
          ":" +
          ("0" + end.getMinutes()).slice(-2) +
          ":" +
          ("0" + end.getSeconds()).slice(-2);
        end1 =
          end.getFullYear() +
          "-" +
          ("0" + (end.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + end.getDate()).slice(-2) +
          " " +
          ("0" + 00).slice(-2) +
          ":" +
          ("0" + 00).slice(-2) +
          ":" +
          ("0" + 00).slice(-2);
        const start_result =
          start.getHours() === 0
            ? await period_2(new Date(start1), new Date(start2))
            : await period_1(new Date(start1), new Date(start2));
        const end_result = await period_2(new Date(end1), new Date(end2));
        if (clock.employee_id === 3) {
          console.log("start_result", start1, start2);
          console.log("start_result", start_result);
          console.log("end_result", end1, end2);
          console.log("end_result", end_result);
        }
        const s_total = floor_num(
          start_result[0] + start_result[1] + start_result[2] + start_result[3]
        );
        const e_total = floor_num(
          end_result[0] + end_result[1] + end_result[2] + end_result[3]
        );
        arr_ans.push(
          {
            total: s_total,
            labour_by_time_period: {
              period1: floor_num(start_result[0]),
              period2: floor_num(start_result[1]),
              period3: floor_num(start_result[2]),
              period4: floor_num(start_result[3]),
            },
            date:
              start.getFullYear() +
              "-" +
              (start.getMonth() + 1) +
              "-" +
              start.getDate(),
          },
          {
            total: e_total,
            labour_by_time_period: {
              period1: floor_num(end_result[0]),
              period2: floor_num(end_result[1]),
              period3: floor_num(end_result[2]),
              period4: floor_num(end_result[3]),
            },
            date:
              end.getFullYear() +
              "-" +
              (end.getMonth() + 1) +
              "-" +
              end.getDate(),
          }
        );
      }
    }
    return arr_ans;
  }
};
const result_json = async (data) => {
  try {
    const result = [];
    if (data) {
      //   console.log(data.clocks);
      if (data.employees.length > 0) {
        for (const e of data.employees) {
          //   console.log("e : ", e.clock_in_datetime, e.clock_out_datetime);
          let emp = data.clocks;
          console.log("e", e.id);
          //   console.log("emp", emp);
          const arr = [];
          const dddd = emp.map((data) => {
            if (data.employee_id === e.id) {
              arr.push(data);
            }
          });
          if (arr.length > 0) {
            const final_data = {
              employee_id: e.id,

              first_name: e.first_name,

              last_name: e.last_name,

              labour: await convertTime(arr),
            };
            result.push(final_data);
          } else {
            console.log("clock not id");
          }
          //   let e = ee.clocks;
        }
      } else {
        console.log("data.employees length is zero");
      }
    } else {
      console.log("result_json not get data");
    }
    return Promise.resolve(result);
  } catch (error) {
    console.log("error : ", error);
    return Promise.reject(false);
  }
};
module.exports = {
  //GET ALL USER INFORMATION
  json_push_file: async (req, res) => {
    try {
      console.log(" json_push_file : calling .....");
      const data = JSON.parse(req.body.data);

      const output = await result_json(data);
      console.log(output);
      fs.writeFile("labour_hours.json", JSON.stringify(output), (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("File successfully written ...  ");
        }
      });
      res.send({
        status: res.statusCode,
        message: "successfully  json_push_file information",
        data: output,
      });

      console.log("json_push_file : successfully ....");
    } catch (error) {
      res.send({
        status: res.statusCode,
        message: error.message,
        data: 1,
      });
      console.log("json_push_file : error message: ", error.message);
    }
  },
};
