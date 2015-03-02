/*MODULE*/
var sudokuApp = angular.module('sudokuApp', ['ngResource'],function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}'); }
	);


/*CONTROLLER*/
sudokuApp.controller('sudokuCtrl', function sudokuCtrl($scope, $http) {
    $http.get("data/cells.json").success(function(data) {
        $scope.rows = jQuery.extend(true, [], data);
        $scope.clearall = jQuery.extend(true, [], data);
        $scope.possibleSol = [];
        $scope.isDisabled = false;

        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                $scope.clearall[i].columns[j].num = "";
                $scope.clearall[i].columns[j].class = "";
            }
        }
    });

    //This function will determine whether each row is solved or not
    function hasSolved(rows)
    {
        for(var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (rows[i].columns[j].num == "") {
                    return false;
                }
            }
        }
        return true;
    }

    //This function will determine if the cell inputted is correct or not.
    //Ex. If the cell has the same value in a row/column, it will be an error marked as red.
    //Otherwise, if not, it will be marked as green.
    function checkCorrect (check, num) {
        return num;
    };

    //This function will set up the number of rows and columns of the cells.
    function getRowsAndColumns(row_id, column_id){
        var i = row_id / 3;
        var rmin = 0;
        var rmax = 0;

        if (i < 1){
            rmin = 0;
            rmax = 3;
        }
        else{
            if(i < 2){
                rmin = 3;
                rmax = 6;
            }
            else if(i < 3){
                rmin = 6;
                rmax = 9;
            }
        }
        var i = column_id / 3;
        var cmin = 0;
        var cmax = 0;
        if (i < 1){
            cmin = 0;
            cmax = 3;
        }
        else{
            if(i < 2){
                cmin = 3;
                cmax = 6;
            }
            else if(i < 3){
                cmin = 6;
                cmax = 9;
            }
        }
        return [rmin, rmax, cmin, cmax];
    };

    //This function will find various indexes of each rows and columns for possible solutions in each cell.
    function findSolutions(rows, row_id, column_id){
        //Setting up the numbers to find
        var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        //Find each row
        var index = [];
        for(var i = 0; i < numbers.length; i++){
            for(var j = 0; j < 9; j++){
                if (numbers[i] == rows[row_id].columns[j].num){
                    index.push(i);
                    j = 9;
                }
            }
        }
        for (var i = 0; i < index.length; i++){
            var j = (i == 0) ? index[i] : index[i] - i;
            numbers.splice(j,1);
        }

        //Find each columns.
        var index = [];
        for(var i = 0; i < numbers.length; i++){
            for(var j = 0; j < 9; j++){
                if (numbers[i] == rows[j].columns[column_id].num){
                    index.push(i);
                    j = 9;
                }
            }
        }
        for (var i = 0; i < index.length; i++){
            var j = (i == 0) ? index[i] : index[i] - i;
            numbers.splice(j,1);
        }

        //Find various ways for the correct numbers in each row and column.
        var index = [];
        var sides = getRowsAndColumns(row_id, column_id)
        var rmin = sides[0];
        var rmax = sides[1];
        var cmin = sides[2];
        var cmax = sides[3];
        for(var i = 0; i < numbers.length; i++) {
            for (var j = rmin; j < rmax; j++) {
                for (var k = cmin; k < cmax; k++) {
                    if (numbers[i] == rows[j].columns[k].num) {
                        index.push(i);
                        j = 9;
                        k = 9;
                    }
                }
            }
        }

        for (var i = 0; i < index.length; i++){
            var j = (i == 0) ? index[i] : index[i] - i;
            numbers.splice(j, 1);
        }
        return numbers;
    }

    //This will find the solution in a row.
    function rowSolution(rows, xy){
        var numbers = [1,2,3,4,5,6,7,8,9];
        var index = [];
        for(var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                if (numbers[r] == rows[xy].columns[c].num) {
                    index.push(r);
                    c = 9;
                }
            }
        }
        for (var i = 0; i < index.length; i++){
            var j = (i == 0) ? index[i] : index[i] - i;
            numbers.splice(j, 1);
        }
        return numbers;
    }

    //This will find the solution in a column.
    function columnSolution(rows, xy){
        var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var index = [];
        for(var col = 0; col < 9; col++) {
            for (var l = 0; l < 9; l++) {
                if (numbers[col] == rows[l].columns[xy].num) {
                    index.push(col);
                    l = 9;
                }
            }
        }
        for (var i = 0; i < index.length; i++){
            var j = (i == 0) ? index[i] : index[i] - i;
            numbers.splice(j, 1);
        }
        return numbers;
    }

    //This will find various ways of what solutions there are from each row and column.
    function condSolution(rows, xy){
        var crow = Math.floor(xy / 3);
        var ccolumn = xy % 3;
        crow *= 3;
        ccolumn *= 3;
        var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var index = [];
        for(var m = 0; m < 9; m++)
            for(var n = crow; n < (crow+3); n++) {
                for (var k = ccolumn; k < (ccolumn + 3); k++) {
                    if (numbers[m] == rows[n].columns[k].num) {
                        index.push(m);
                        n = 9;
                        k = 9;
                    }
                }
            }

        for (var i = 0; i < index.length; i++){
            var j = (i == 0) ? index[i] : index[i] - i;
            numbers.splice(j, 1);
        }

        return numbers;
    }

    //This function will find the values that are unique only from each row and column.
    function findUniqueValues(rows){
        //Setting a boolean whether the values or unique or not.
        isUnique = false;

        //Finding the unique values in the row.
        for(var i = 0; i < 9; i++){
            var urows = rowSolution(rows, i);
            for(var ur = 0; ur < urows.length; ur++){
                var cell = 0;
                var receiveCol = 0;
                for(var cl = 0; cl < 9 && cell < 2; cl++){
                    if(rows[i].columns[cl].num == ""){
                        //var m;//need to check if this value is a possibility for this cell
                        for(var k = 0; (k < rows[i].columns[cl].answers.length && rows[i].columns[cl].answers[k] != urows[ur]); k++);
                        if(rows[i].columns[cl].answers[k] == urows[ur]){
                            cell++;
                            receiveCol = cl;
                        }
                    }
                }
                if(cell == 0)
                    return [false, isUnique];
                if(cell == 1){
                    rows[i].columns[receiveCol].num = urows[ur];
                    isUnique = true;
                }
            }
        }

        //Finding the unique values in the column.
        for(var c = 0; c < 9; c++){
            var column_numbers = columnSolution(rows, c);
            for(var p = 0; p < column_numbers.length; p++){
                var cell = 0;
                var receiveRow = 0;
                for(var l = 0; l < 9 && cell < 2; l++){
                    if(rows[l].columns[c].num == ""){
                        for(var n = 0; (n < rows[l].columns[c].answers.length && rows[l].columns[c].answers[n] != column_numbers[p]); n++);
                        if(rows[l].columns[c].answers[n] == column_numbers[p]){
                            cell++;
                            receiveRow = l;
                        }
                    }
                }
                if(cell == 0) {
                    return [false, isUnique];
                }

                if(cell == 1){
                    rows[receiveRow].columns[c].num = column_numbers[p];
                    isUnique = true;
                }
            }
        }

        //Finding various unique values of the solution.
        for(var i = 0; i < 9; i++)
        {
            var uniqNum = condSolution(rows, i);
            var crow = Math.floor(i/3);
            var ccolumn = i % 3;
            var un = 0;
            var receive = 0;
            crow *= 3;
            ccolumn *= 3;

            //Determining the correct values in each rows and columns
            for(var k = 0; k < uniqNum.length; k++)
            {
                for(var j = 0; (j < 9 && un < 2); j++)
                    if(rows[crow + Math.floor(j/3)].columns[ccolumn + (j%3)].num == ""){
                        var m;
                        for(m = 0; (m < rows[crow + Math.floor(j/3)].columns[ccolumn + (j%3)].answers.length && rows[crow + Math.floor(j/3)].columns[ccolumn + (j%3)].answers[m] != uniqNum[k]); m++);
                        if(rows[crow + Math.floor(j/3)].columns[ccolumn + (j%3)].answers[m] == uniqNum[k])
                        {
                            un++;
                            receive = j;
                        }
                    }
                if(un == 0)
                    return [false, isUnique];
                if(un  == 1)
                {
                    rows[crow + Math.floor(receive/3)].columns[ccolumn + (receive%3)].num = uniqNum[k];
                    isUnique = true;
                }
            }
        }
        return [true, isUnique];
    }

    //This will solve in rows.
    function rowsSolve(rows){
        var isUnique1 = true;
        var isUnique2 = true;
        while(isUnique1){
            isUnique1 = false;
            while(isUnique2){
                isUnique2 = false;
                for(var r = 0; r < 9; r++)
                    for(var c = 0; c < 9; c++)
                        if(rows[r].columns[c].num == ""){
                            rows[r].columns[c].answers = jQuery.extend(true, [], findSolutions(rows,r,c));
                            answers_length = rows[r].columns[c].answers.length;
                            if(answers_length == 0){
                                return false;
                            }
                            if(answers_length == 1){
                                isUnique1 = true;
                                isUnique2 = true;
                                rows[r].columns[c].num = rows[r].columns[c].answers[0];
                            }

                        }
            }
            isUnique2 = true;
            while(isUnique2){
                isUnique2 = false;

                //Note: This 'isUnique' is calling from the ones above.
                isUnique = findUniqueValues(rows);
                if(isUnique[1]){
                    isUnique1 = true;
                    isUnique2 = true;
                }
                if(isUnique[0] == false){
                    return false;
                }
            }
        }

        if(hasSolved(rows)){
            return {'isUnique':true, 'rows':jQuery.extend(true, [], rows)};
        }
        return solveRandomly(rows);
        return {'isUnique' :false, 'rows':''};
    }

    //This function will solve the solution in many random ways if either there is no values or if you
    //inputted incompleted values in the cells.
    function solveRandomly(rows){
        for(var v = 0; v < 9; v++)
            for(var c = 0; c < 9; c++) {
                if (rows[v].columns[c].num == "") {
                    rows[v].columns[c].answers = jQuery.extend(true, [], findSolutions(rows, v, c));
                    recv = rows[v].columns[c].answers.length;

                    while (recv > 0) {
                        correctrows = jQuery.extend(true, [], rows);
                        var r = Math.floor((Math.random() * 10) + 1) % recv;
                        correctrows[v].columns[c].num = correctrows[v].columns[c].answers[r]
                        results = rowsSolve(correctrows);
                        if (results['isUnique']) {
                            return {'isUnique': true, 'rows': jQuery.extend(true, [], results['rows'])};
                        }
                        else {
                            correctrows[v].columns[c].answers.splice(r, 1);
                            recv--;
                        }
                    }
                }
            }

        return {'isUnique' :false, 'rows':''};
    }

    //This scope will retrieve the value and returns an empty string if the numbers are not from 1 - 9.
    //Otherwise, it will return the number.
    $scope.getVal = function(num, row_id, column_id) {
        if (!(num >= 1 && num <= 9)){
            return "";
        }
        return num;
    }

    //This scope will clear all the values from the grid.
    $scope.clear = function() {
        $scope.rows = jQuery.extend(true, [], $scope.clearall);
        $scope.isDisabled = false;
    }

    //This scope will check the values and make sure if they're unique or not as well as finding possible answers and
    //solving the entire grid itself.
    $scope.check = function(row_id, column_id) {
        row_id = row_id - 1;
        column_id = column_id - 1;
        num = $scope.rows[row_id].columns[column_id].num;

        //Checks whether the number is legal as well as a finite number.
        if (!(!isNaN(parseFloat(num)) && isFinite(num))){
            $scope.rows[row_id].columns[column_id].class = checkCorrect($scope.rows[row_id].columns[column_id].class, "error");
            $scope.rows[row_id].columns[column_id].num = '';
            return;

        }

        //This scope will determine if the values in a row or column is valid.
        //If it is valid, then the value will be marked 'green' as well as enable the 'Solve' button.
        $scope.rows[row_id].columns[column_id].class =  checkCorrect($scope.rows[row_id].columns[column_id].class,"valid");
        $scope.isDisabled = false;

        //Otherwise, if the values are not unique in either rows or columns, the values will be marked 'red' and the
        //'Solve' button will be disabled.
        //Rows
        for(var j = 0; j < 9; j++)
        {
            if((num == $scope.rows[row_id].columns[j].num) && column_id != j){
                $scope.rows[row_id].columns[column_id].class = checkCorrect($scope.rows[row_id].columns[column_id].class,"error");
                $scope.rows[row_id].columns[j].class = checkCorrect($scope.rows[row_id].columns[j].class, "error");
                $scope.isDisabled = true;
            }

        }

        //Columns
        for(var j = 0; j < 9; j++)
        {
            if((num == $scope.rows[j].columns[column_id].num) && row_id != j){
                $scope.rows[row_id].columns[column_id].class = checkCorrect($scope.rows[row_id].columns[column_id].class, "error");
                $scope.rows[j].columns[column_id].class = checkCorrect("error", $scope.rows[j].columns[column_id].class);
                $scope.isDisabled = true;
            }

        }

        //Finds the maximum and minimum sides from the rows and columns
        var sides = getRowsAndColumns(row_id, column_id)
        var rmin = sides[0];
        var rmax = sides[1];
        var cmin = sides[2];
        var cmax = sides[3];

        for(var j = rmin; j < rmax; j++) {
            for (var k = cmin; k < cmax; k++) {
                if ((num == $scope.rows[j].columns[k].num) && j != row_id && k != column_id) {
                    $scope.rows[row_id].columns[column_id].class = checkCorrect($scope.rows[row_id].columns[column_id].class, "error");
                    $scope.rows[j].columns[k].class = checkCorrect($scope.rows[j].columns[k].class, "error");
                    $scope.isDisabled = true;
                }
            }
        }
    };

    //This scope will check if the answers of each value is correct.
    $scope.answers = function(row_id, column_id) {
        row_id = row_id - 1;
        column_id = column_id - 1;
        numbers = findSolutions($scope.rows, row_id, column_id);
        $scope.rows[row_id].columns[column_id].answers = jQuery.extend(true, [], numbers);
        $scope.possibleSol = jQuery.extend(true, [], numbers);

    };

    //This scope will solve the entire grid.
    $scope.solve = function() {
        results = rowsSolve($scope.rows);
        if(results['isUnique']){
            $scope.rows = jQuery.extend(true, [], results['rows']);
        }

    }
}); //end of Controller

/*FILTERS*/
//This will allow to adjust the columns so that it will show it as a 3x3 for each column.
sudokuApp.filter('columns_33', function() {
    return function(input) {
        return input % 3 == 1 ? 'marginLeft' : '';
    };
});

//This will allow to adjust the rowss so that it will show it as a 3x3 for each row.
sudokuApp.filter('rows_33', function() {
    return function(input) {
        return (input % 3 == 0 && input < 9) ? 'marginBottom' : '';
    };
});