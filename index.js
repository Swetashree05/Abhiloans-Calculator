function calculateResults() {
  const portfolio = parseFloat(document.getElementById("portfolio").value);
  const schemeType = document.getElementById("schemeType").value;
  const tenure = parseInt(document.getElementById("tenure").value);
  const cagr = parseFloat(document.getElementById("cagr").value) / 100;
  const interestRate =
    parseFloat(document.getElementById("interestRate").value) / 100;

  const LTV = schemeType === "Debt" ? 0.75 : 0.65;
  console.log("LTV is::", LTV);
  const eligibleLoan = formulajs.PRODUCT(portfolio, LTV);
  console.log("Eligible Loan is::", eligibleLoan);

  // Sell MF's Ending Balance Calculation
  const redemption = eligibleLoan;
  const amt = formulajs.PV(cagr, tenure, 0, -portfolio);
  console.log("Amount::", amt);
  const capitalGains = formulajs.PRODUCT(
    0.1,
    formulajs.PRODUCT(redemption / portfolio, formulajs.MINUS(portfolio, amt))
  );
  let balance = formulajs.MINUS(
    portfolio,
    formulajs.SUM(redemption, capitalGains)
  );

  let endingBalanceSell = balance;
  for (let year = 1; year <= tenure; year++) {
    const gain = formulajs.PRODUCT(endingBalanceSell, cagr);
    endingBalanceSell = formulajs.SUM(endingBalanceSell, gain);
  }

  // Take a Loan Ending Balance Calculation
  console.log("eligibleLoan::", eligibleLoan);
  console.log("interestRate::", interestRate);
  console.log("tenure::", tenure);
  const interestPayment = formulajs.PRODUCT(
    eligibleLoan,
    formulajs.PRODUCT(interestRate, tenure)
  );
  console.log("interestPayment::", interestPayment);
  let endingBalanceLoan = portfolio;
  for (let year = 1; year <= tenure; year++) {
    const gain = formulajs.PRODUCT(endingBalanceLoan, cagr);
    endingBalanceLoan = formulajs.SUM(endingBalanceLoan, gain);
  }
  endingBalanceLoan = formulajs.MINUS(
    endingBalanceLoan,
    formulajs.SUM(eligibleLoan, interestPayment)
  );
  const advantage = formulajs.MINUS(endingBalanceLoan, endingBalanceSell);

  // Display Results
  document.getElementById(
    "sellMFResult"
  ).innerText = `Sell MF's Ending Balance: ${Math.round(endingBalanceSell)}`;
  document.getElementById(
    "loanResult"
  ).innerText = `Take a Loan Ending Balance: ${Math.round(endingBalanceLoan)}`;
  document.getElementById("advantage").innerText = `Advantage: ${Math.round(
    advantage
  )}`;
}
