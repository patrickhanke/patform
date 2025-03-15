import { useQuery } from '@apollo/client';
import { useContext } from 'react';
import {
    generateGraphQLQuery,
    paramsHandler,
    UserContext,
} from '@repo/provider';
import { useCallback } from 'react';
import { GetWorkingTimes, PeriodObject } from './types';
import findSurchargesForDay from './functions/findSurchargesForDay';
import { get, set } from 'lodash-es';
import checkSurchargeTimeCondition from './functions/checkSurchargeTimeCondition';
import checkSurchargeDayCondition from './functions/checkSurchargeDayCondition';

const useGenerateTimes = () => {
    const { projectId } = useContext(UserContext);
    const { data } = useQuery(
        generateGraphQLQuery({
            type: 'find',
            objectName: 'Surcharge',
            fields: [
                'objectId',
                'name',
                'createdAt',
                'active',
                'type',
                'time_value',
                'day_value',
                'work_value',
                'value',
                'start_date',
                'end_date',
            ],
        }),
        {
            variables: {
                params: paramsHandler({
                    filters: [
                        {
                            key: 'project',
                            value: projectId,
                            operator: '_eq',
                            id: 'projectId',
                        },
                    ],
                }),
            },
        }
    );

    const getWorkingTimes: GetWorkingTimes = useCallback(
        ({ days }) => {
            const periodObject: PeriodObject = {
                days: [],
                time_overview: {
                    label: 'Zeitenübersicht',
                    time: {
                        label: 'Arbeitszeit',
                        value: 0,
                    },
                    target: {
                        label: 'Sollzeit',
                        value: 0,
                    },
                    breaks: {
                        label: 'Pausenzeit',
                        value: 0,
                    },
                    saldo: {
                        label: 'Saldo',
                        value: 0,
                    },
                },
                surcharges: {
                    label: 'Zuschläge',
                },
                vacation: 0,
                absence: 0,
                working_days: 0,
            };
            if (data) {
                const surcharges = data?.objects.findSurcharge.results;
                days.forEach(day => {
                    periodObject.days.push(day);
                    if (day.type === 'absence' && day.is_working_day) {
                        if (day?.absence?.type === 'vacation') {
                            set(
                                periodObject,
                                'vacation',
                                (periodObject.vacation += 1)
                            );
                        } else {
                            set(
                                periodObject,
                                'absence',
                                (periodObject.absence += 1)
                            );
                        }
                        if (day.is_working_day) {
                            set(
                                periodObject,
                                'time_overview.target.value',
                                (periodObject.time_overview.target.value +=
                                    day?.default_time?.duration || 0)
                            );
                            set(
                                periodObject,
                                'time_overview.breaks.value',
                                (periodObject.time_overview.breaks.value +=
                                    day?.default_time?.pause || 0)
                            );
                            set(
                                periodObject,
                                'time_overview.saldo.value',
                                (periodObject.time_overview.saldo.value +=
                                    (day?.default_time?.duration || 0) -
                                    (day?.default_time?.pause || 0))
                            );
                        }
                    }

                    if (day.type === 'work' && day?.time) {
                        set(
                            periodObject,
                            'working_days',
                            (periodObject.working_days += 1)
                        );
                        set(
                            periodObject,
                            'time_overview.time.value',
                            (periodObject.time_overview.time.value +=
                                day.time.duration)
                        );
                        set(
                            periodObject,
                            'time_overview.breaks.value',
                            (periodObject.time_overview.breaks.value +=
                                day.time.pause)
                        );
                        set(
                            periodObject,
                            'time_overview.saldo.value',
                            (periodObject.time_overview.saldo.value +=
                                day.time.duration - day.time.pause)
                        );
                    }

                    const surchargesForDay = findSurchargesForDay({
                        day,
                        surcharges,
                    });

                    surchargesForDay.forEach(surcharge => {
                        const existingValue = get(
                            periodObject,
                            `surcharges.${surcharge.objectId}.value`
                        );

                        console.log({ existingValue });

                        if (surcharge.type === 'time') {
                            const surchargeValue = checkSurchargeTimeCondition({
                                day,
                                surcharge,
                            });
                            console.log({ surchargeValue });
                            if (existingValue) {
                                set(
                                    periodObject,
                                    `surcharges.${surcharge.objectId}.value`,
                                    existingValue + surchargeValue
                                );
                            } else {
                                set(
                                    periodObject,
                                    `surcharges.${surcharge.objectId}`,
                                    {
                                        value: surchargeValue,
                                        label: surcharge.name,
                                    }
                                );
                            }
                        } else if (surcharge.type === 'day') {
                            const surchargeValue = checkSurchargeDayCondition({
                                day,
                                surcharge,
                            });
                            if (existingValue) {
                                set(
                                    periodObject,
                                    `surcharges.${surcharge.objectId}.value`,
                                    existingValue + surchargeValue
                                );
                            } else {
                                set(
                                    periodObject,
                                    `surcharges.${surcharge.objectId}`,
                                    {
                                        value: surchargeValue,
                                        label: surcharge.name,
                                    }
                                );
                            }
                        } else if (surcharge.type === 'work') {
                            console.log(null);
                        } else if (surcharge.type === 'overtime') {
                            if (day.saldo) {
                                const surchargeValue = day.saldo
                                    ? day.saldo
                                    : 0;
                                if (existingValue) {
                                    set(
                                        periodObject,
                                        `surcharges.${surcharge.objectId}.value`,
                                        existingValue + surchargeValue
                                    );
                                } else {
                                    set(
                                        periodObject,
                                        `surcharges.${surcharge.objectId}`,
                                        {
                                            value: surchargeValue,
                                            label: surcharge.name,
                                        }
                                    );
                                }
                            }
                        }
                    });
                });
            }
            return periodObject;
        },
        [data]
    );

    return { getWorkingTimes };
};

export default useGenerateTimes;
