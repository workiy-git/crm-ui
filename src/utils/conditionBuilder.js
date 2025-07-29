export const buildMatchCondition = (condition) => {
    const { fieldName, operator, value } = condition;

    switch (operator) {
        case "$eq":
        case "$ne":
        case "$gt":
        case "$lt":
            return {
                [fieldName]: { [operator]: value }
            };

        case "$regex":
            return {
                [fieldName]: { [operator]: value, $options: "i" }
            };

        case "$^regex":
            return {
                [fieldName]: { $regex: `^${value}`, $options: "i" }
            };

        case "$regex$":
            return {
                [fieldName]: { $regex: `${value}$`, $options: "i" }
            };

        case "doesNotContain":
            return {
                [fieldName]: { $not: { $regex: value, $options: "i" } }
            };

        case "is checked":
            return {
                [fieldName]: true
            };

        case "is not checked":
            return {
                [fieldName]: false
            };

        case "$gte_lte":
            if (value?.start && value?.end) {
                return {
                    [fieldName]: {
                        $gte: value.start,
                        $lte: value.end
                    }
                };
            }
            return null;

        case "$eqto":
            return {
                [fieldName]: value
            };

        case "$gte_today_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $eq: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$$NOW"
                                    }
                                }
                            ]
                        }
                    ]
                }
            };

        case "$gte_yesterday_lte":
            return {
                $expr: {
                    $eq: [
                        {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: { $toDate: `$${fieldName}` }
                            }
                        },
                        {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: {
                                    $dateSubtract: {
                                        startDate: "$$NOW",
                                        unit: "day",
                                        amount: 1
                                    }
                                }
                            }
                        }
                    ]
                }
            };

        case "$gte_tomorrow_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $eq: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateAdd: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 1
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };

        case "$gte_thisweek_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $dateSubtract: {
                                                startDate: "$$NOW",
                                                unit: "day",
                                                amount: {
                                                    $subtract: [{ $dayOfWeek: "$$NOW" }, 1]
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $dateAdd: {
                                                startDate: "$$NOW",
                                                unit: "day",
                                                amount: {
                                                    $subtract: [8, { $dayOfWeek: "$$NOW" }]
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_nextweek_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $dateAdd: {
                                                startDate: "$$NOW",
                                                unit: "day",
                                                amount: { $subtract: [8, { $dayOfWeek: "$$NOW" }] }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $dateAdd: {
                                                startDate: "$$NOW",
                                                unit: "day",
                                                amount: { $subtract: [15, { $dayOfWeek: "$$NOW" }] }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };
        case "$gte_thismonth_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $dateFromParts: {
                                                year: { $year: "$$NOW" },
                                                month: { $month: "$$NOW" },
                                                day: 1
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $dateFromParts: {
                                                year: { $year: "$$NOW" },
                                                month: { $add: [{ $month: "$$NOW" }, 1] },
                                                day: 1
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_nextmonth_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $dateFromParts: {
                                                year: { $year: "$$NOW" },
                                                month: { $add: [{ $month: "$$NOW" }, 1] },
                                                day: 1
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $dateFromParts: {
                                                year: { $year: "$$NOW" },
                                                month: { $add: [{ $month: "$$NOW" }, 2] },
                                                day: 1
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_last7days_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateSubtract: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 7
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: "$$NOW" }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_last30days_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateSubtract: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 30
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: "$$NOW" }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_last45days_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateSubtract: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 45
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: "$$NOW" }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };

        case "$gte_last60days_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateSubtract: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 60
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: "$$NOW" }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_last90days_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateSubtract: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 90
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: "$$NOW" }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_last120days_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateSubtract: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 120
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: "$$NOW" }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_next7days_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateAdd: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 1
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateAdd: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 8
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_next30days_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateAdd: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 1
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateAdd: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 31
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_next45days_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateAdd: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 1
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateAdd: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 46
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_next60days_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateAdd: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 1
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateAdd: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 61
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_next90days_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateAdd: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 1
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateAdd: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 91
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_next120days_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateAdd: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 1
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateAdd: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 121
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_previousFinancialYear_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateFromParts: {
                                                    year: { $subtract: [{ $year: "$$NOW" }, 1] },
                                                    month: 4,
                                                    day: 1
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateFromParts: {
                                                    year: { $year: "$$NOW" },
                                                    month: 4,
                                                    day: 1
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_currentFinancialYear_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateFromParts: {
                                                    year: { $year: "$$NOW" },
                                                    month: 4,
                                                    day: 1
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` }
                                    }
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateFromParts: {
                                                    year: { $add: [{ $year: "$$NOW" }, 1] },
                                                    month: 4,
                                                    day: 1
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            };


        case "$gte_nextFinancialYear_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` },
                                    },
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateFromParts: {
                                                    year: { $add: [{ $year: "$$NOW" }, 1] },
                                                    month: 4,
                                                    day: 1,
                                                },
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` },
                                    },
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateFromParts: {
                                                    year: { $add: [{ $year: "$$NOW" }, 2] },
                                                    month: 4,
                                                    day: 1,
                                                },
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            };


        case "$gte_previousWeek_lte":
            return {
                $expr: {
                    $and: [
                        { $ne: [`$${fieldName}`, null] },
                        { $ne: [`$${fieldName}`, ""] },
                        {
                            $gte: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` },
                                    },
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateAdd: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: -7,
                                                },
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            $lt: [
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: { $toDate: `$${fieldName}` },
                                    },
                                },
                                {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $toDate: {
                                                $dateAdd: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 0,
                                                },
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            };

        default:
            console.warn("Operator not handled:", operator);
    }
};