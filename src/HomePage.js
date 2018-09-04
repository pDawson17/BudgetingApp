import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Picker,
  AsyncStorage,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import PieChart from "react-native-pie-chart";
import Panel from "react-native-panel";

const expenseTypes = [
  "Food",
  "Housing",
  "Gas",
  "Recreation",
  "Work Expenses",
  "Travel",
  "Snacks",
  "Medical",
  "Clothing",
  "Household Supplies",
  "Other"
];
const iconNames = {
  Food: ["food", "green"],
  Housing: ["city", "red"],
  Gas: ["gas-station", "orange"],
  Recreation: ["gamepad-variant", "#145dd1"],
  "Work Expenses": ["briefcase", "#e1f2b5"],
  Travel: ["airplane", "#630404"],
  Snacks: ["cookie", "#ad825d"],
  Medical: ["needle", "#8e64b7"],
  Clothing: ["tshirt-crew", "#ff2dea"],
  "Household Supplies": ["lamp", "#0acddb"],
  Other: ["dots-horizontal", "#707070"]
};

export default class HomePage extends Component {
  componentDidMount() {
    this._retreiveData();
  }
  async clearStorage() {
    console.log("clearing");
    AsyncStorage.multiRemove([
      "spendingTotal",
      "incomeTotal",
      "balance",
      "expenseList"
    ]);
    this.setState({
      spendingTotal: 0,
      expenseList: [],
      balance: 0,
      incomeTotal: 0,
      startDate: Date().toString(),
      spendingByCategory: {
        Food: 0,
        Housing: 0,
        Gas: 0,
        Recreation: 0,
        "Work Expenses": 0,
        Travel: 0,
        Snacks: 0,
        Medical: 0,
        Clothing: 0,
        "Household Supplies": 0,
        Other: 0
      }
    });
  }
  async _saveData() {
    try {
      await AsyncStorage.setItem("startDate", this.state.startDate);
    } catch (error) {
      console.log("did not save" + error);
    }
    try {
      await AsyncStorage.setItem("spendingTotal", this.state.spendingTotal);
    } catch (error) {
      console.log("did not save" + error);
    }
    try {
      await AsyncStorage.setItem("incomeTotal", this.state.incomeTotal);
    } catch (error) {
      console.log("did not save" + error);
    }
    try {
      await AsyncStorage.setItem("balance", this.state.balance);
    } catch (error) {
      console.log("did not save" + error);
    }
    try {
      await AsyncStorage.setItem(
        "expenseList",
        JSON.stringify(this.state.expenseList)
      );
    } catch (error) {
      console.log("did not save" + error);
    }
    try {
      await AsyncStorage.setItem(
        "categorySpending",
        JSON.stringify(this.state.spendingByCategory)
      );
    } catch (error) {
      console.log("did not save" + error);
    }
  }
  async _retreiveData() {
    try {
      const _spendingTotal = await AsyncStorage.getItem("spendingTotal");
    } catch (error) {
      console.log("did not load" + error);
    }
    try {
      const _incomeTotal = await AsyncStorage.getItem("incomeTotal");
    } catch (error) {
      console.log("did not load" + error);
    }
    try {
      const _balance = await AsyncStorage.getItem("balance");
    } catch (error) {
      console.log("did not load" + error);
    }
    try {
      var x = await AsyncStorage.getItem("expenseList");
      const _expenseList = JSON.parse(x);
    } catch (error) {
      console.log("did not load" + error);
    }
    try {
      var y = await AsyncStorage.getItem("categorySpending");
      const _spendingByCategory = JSON.parse(y);
    } catch (error) {
      console.log("did not load" + error);
    }
    this.setState({
      spendingTotal: _spendingTotal,
      incomeTotal: _incomeTotal,
      balance: _balance,
      expenseList: [],
      spendingByCategory: _spendingByCategory
    });
  }
  state = {
    createExpenditure: false,
    spendingGoal: 0,
    spendingTotal: 0,
    incomeTotal: 0,
    showModal: false,
    showHistory: false,
    incomeAmount: 0,
    balance: 0,
    expenseList: [],
    expenseType: "Food",
    expenseAmount: 0,
    expenditure: ["", 0, "", ""], //category, amount, note, date
    income: ["", 0], //date, amount
    note: "",
    startDate: "",
    spendingByCategory: {
      Food: 0,
      Housing: 0,
      Gas: 0,
      Recreation: 0,
      "Work Expenses": 0,
      Travel: 0,
      Snacks: 0,
      Medical: 0,
      Clothing: 0,
      "Household Supplies": 0,
      Other: 0
    }
  };
  render() {
    var ls = [];
    var allZero = true;
    for (var i = 0; i < expenseTypes.length; i++) {
      ls.push(this.state.spendingByCategory[expenseTypes[i]]);
      if (this.state.spendingByCategory[expenseTypes[i]] !== 0) {
        allZero = false;
      }
    }
    if (allZero) {
      ls = [1];
    }
    const pieChartList = ls;
    return (
      <ScrollView>
        <View
          style={{
            height: 120,
            alignSelf: "stretch"
          }}
        >
          <Text style={{ fontSize: 40, textAlign: "center" }}>
            Dead Simple Budgeting
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View>
            <Text>Since {this.state.startDate.substring(0, 11)}</Text>
            <Text style={{ fontSize: 20 }}>Balance: ${this.state.balance}</Text>
            <Text style={{ fontSize: 20 }}>
              Income: ${this.state.incomeTotal}
            </Text>
            <Text style={{ fontSize: 20 }}>
              Spending: ${this.state.spendingTotal}
            </Text>
          </View>
          <Text style={{ fontSize: 50, left: 160, marginTop: 10 }}>
            {Date()
              .toString()
              .substring(3, 7)}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => this.setState({ createExpenditure: true })}
          >
            <Text style={styles.buttonTextStyle}>New Expenditure</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => this.setState({ showModal: true })}
          >
            <Text style={styles.buttonTextStyle}>Add Income</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row" }}>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ alignItems: "center" }}>
              {this.state.expenseList.slice(0, 6).map((item, index) => {
                return (
                  <Panel
                    header={() => {
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            backgroundColor: "#262A2C",
                            borderRadius: 60
                          }}
                        >
                          <Icon
                            name={
                              iconNames[this.state.expenseList[index][0]][0]
                            }
                            size={40}
                            color={
                              iconNames[this.state.expenseList[index][0]][1]
                            }
                          />
                          <Text
                            style={{
                              color: "white",
                              padding: 5,
                              paddingLeft: 10,
                              paddingRight: 10
                            }}
                          >
                            ${this.state.expenseList[index][1]}{" "}
                          </Text>
                        </View>
                      );
                    }}
                  >
                    <Text>
                      {this.state.expenseList[index][2]}
                      {"\n"}
                      {this.state.expenseList[index][3]}
                    </Text>
                  </Panel>
                );
              })}
            </View>
          </ScrollView>
          <ScrollView style={{ flex: 3 }}>
            <Text>Stats</Text>
            <PieChart
              chart_wh={200}
              series={pieChartList}
              doughnut={true}
              sliceColor={[
                "green",
                "red",
                "orange",
                "#145dd1",
                "#e1f2b5",
                "#630404",
                "#ad825d",
                "#8e64b7",
                "#ff2dea",
                "#0acddb",
                "#707070"
              ]}
            />
          </ScrollView>
        </View>
        <Modal
          visible={this.state.showHistory}
          onRequestClose={() => this.setState({ showHistory: false })}
        >
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => this.setState({ showHistory: false })}
            >
              <Icon name={"arrow-left-bold"} size={40} color={"black"} />
            </TouchableOpacity>
            {this.state.expenseList.map((item, index) => {
              return (
                <Panel
                  header={() => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          width: 200,
                          height: 50,
                          backgroundColor: "#262A2C",
                          borderRadius: 60,
                          marginBottom: 5
                        }}
                      >
                        <Icon
                          name={iconNames[this.state.expenseList[index][0]][0]}
                          size={40}
                          color={iconNames[this.state.expenseList[index][0]][1]}
                        />
                        <Text
                          style={{
                            color: "white",
                            padding: 5,
                            paddingLeft: 10,
                            paddingRight: 10
                          }}
                        >
                          ${this.state.expenseList[index][1]}{" "}
                        </Text>
                      </View>
                    );
                  }}
                >
                  <Text>
                    {this.state.expenseList[index][2]}
                    {"\n"}
                    {this.state.expenseList[index][3]}
                  </Text>
                </Panel>
              );
            })}
          </View>
        </Modal>
        <Modal
          visible={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}
        >
          <View style={styles.modalViewStyle}>
            <TouchableOpacity
              onPress={() => this.setState({ showModal: false })}
            >
              <Icon name={"arrow-left-bold"} size={40} color={"black"} />
            </TouchableOpacity>
            <Text>How much did you make?</Text>
            <TextInput
              keyboardType={"numeric"}
              value={this.state.incomeAmount}
              onChangeText={value =>
                this.setState({ incomeAmount: parseFloat(value) })
              }
              style={{ width: 200, borderColor: "black", borderWidth: 2 }}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              this._saveData();
              this.setState({
                showModal: false,
                balance: this.state.balance + this.state.incomeAmount,
                incomeTotal: this.state.incomeTotal + this.state.incomeAmount,
                incomeAmount: 0
              });
            }}
          >
            <Text style={styles.buttonTextStyle}>Submit</Text>
          </TouchableOpacity>
        </Modal>
        <Modal
          visible={this.state.createExpenditure}
          onRequestClose={() => this.setState({ createExpenditure: false })}
        >
          <View style={styles.modalViewStyle}>
            <TouchableOpacity
              onPress={() => this.setState({ createExpenditure: false })}
            >
              <Icon name={"arrow-left-bold"} size={40} color={"black"} />
            </TouchableOpacity>
            <Text>What type of Expense is this?</Text>
            <Picker
              style={{ height: 100, width: 140 }}
              selectedValue={this.state.expenseType}
              onValueChange={value => this.setState({ expenseType: value })}
            >
              {expenseTypes.map((item, index) => {
                return <Picker.Item label={item} value={item} key={index} />;
              })}
            </Picker>
            <Text>Input Amount:</Text>
            <TextInput
              keyboardType={"numeric"}
              value={this.state.expenseAmount}
              onChangeText={value =>
                this.setState({ expenseAmount: parseFloat(value) })
              }
              style={{ width: 200, borderColor: "black", borderWidth: 2 }}
            />
            <Text>Add a note:</Text>
            <TextInput
              value={this.state.note}
              onChangeText={value => this.setState({ note: value })}
              style={{ width: 200, borderColor: "black", borderWidth: 2 }}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              this._saveData();
              let catSpending = JSON.parse(
                JSON.stringify(this.state.spendingByCategory)
              );
              catSpending[this.state.expenseType] =
                catSpending[this.state.expenseType] + this.state.expenseAmount;
              this.setState({
                expenseList: this.state.expenseList.concat([
                  [
                    this.state.expenseType,
                    this.state.expenseAmount,
                    this.state.note,
                    Date()
                      .toString()
                      .substring(0, 11)
                  ]
                ]),
                balance: this.state.balance - this.state.expenseAmount,
                spendingTotal:
                  this.state.spendingTotal + this.state.expenseAmount,
                expenseType: "Food",
                expenseAmount: 0,
                note: "",
                createExpenditure: false,
                spendingByCategory: catSpending
              });
            }}
          >
            <Text style={styles.buttonTextStyle}>Submit</Text>
          </TouchableOpacity>
        </Modal>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => this.setState({ showHistory: true })}
        >
          <Text style={styles.buttonTextStyle}>Show Full Period History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() =>
            Alert.alert(
              "Clear All Data?",
              "restart with a new Budgeting Period. All previous data will be deleted",
              [
                { text: "cancel", onPress: () => console.log("close") },
                { text: "continue", onPress: () => this.clearStorage() }
              ]
            )
          }
        >
          <Text style={styles.buttonTextStyle}>
            Start A New Budgeting Period (Clear all Data)
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
const styles = {
  buttonStyle: {
    borderRadius: 60,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    marginTop: 10
  },
  buttonTextStyle: {
    padding: 5,
    fontSize: 18
  },
  modalViewStyle: {
    marginTop: 20,
    alignSelf: "stretch",
    alignItems: "center"
  }
};
