import { strict as assert } from 'assert';
import {
    transformReplyBoolean,
    transformReplyBooleanArray,
    pushScanArguments,
    transformReplyNumberInfinity,
    transformReplyNumberInfinityArray,
    transformReplyNumberInfinityNull,
    transformArgumentNumberInfinity,
    transformArgumentStringNumberInfinity,
    transformReplyStringTuples,
    transformReplyBufferTuples,
    transformReplyStreamStringMessages,
    transformReplyStreamBufferMessages,
    transformReplyStreamsStringMessages,
    transformReplyStreamsBufferMessages,
    transformReplySortedStringsSetWithScores,
    transformReplySortedBuffersSetWithScores,
    pushGeoCountArgument,
    pushGeoSearchArguments,
    GeoReplyWith,
    transformGeoMembersWithReply,
    transformEXAT,
    transformPXAT,
    pushEvalArguments,
    pushStringTuplesArguments,
    pushVerdictArguments,
    pushVerdictArgument,
    pushOptionalVerdictArgument,
    transformCommandReply,
    CommandFlags,
    CommandCategories
} from './generic-transformers';

describe('Generic Transformers', () => {
    describe('transformReplyBoolean', () => {
        it('0', () => {
            assert.equal(
                transformReplyBoolean(0),
                false
            );
        });

        it('1', () => {
            assert.equal(
                transformReplyBoolean(1),
                true
            );
        });
    });

    describe('transformReplyBooleanArray', () => {
        it('empty array', () => {
            assert.deepEqual(
                transformReplyBooleanArray([]),
                []
            );
        });

        it('0, 1', () => {
            assert.deepEqual(
                transformReplyBooleanArray([0, 1]),
                [false, true]
            );
        });
    });

    describe('pushScanArguments', () => {
        it('cusror only', () => {
            assert.deepEqual(
                pushScanArguments([], 0),
                ['0']
            );
        });

        it('with MATCH', () => {
            assert.deepEqual(
                pushScanArguments([], 0, {
                    MATCH: 'pattern'
                }),
                ['0', 'MATCH', 'pattern']
            );
        });

        it('with COUNT', () => {
            assert.deepEqual(
                pushScanArguments([], 0, {
                    COUNT: 1
                }),
                ['0', 'COUNT', '1']
            );
        });

        it('with MATCH & COUNT', () => {
            assert.deepEqual(
                pushScanArguments([], 0, {
                    MATCH: 'pattern',
                    COUNT: 1
                }),
                ['0', 'MATCH', 'pattern', 'COUNT', '1']
            );
        });
    });

    describe('transformReplyNumberInfinity', () => {
        it('0.5', () => {
            assert.equal(
                transformReplyNumberInfinity('0.5'),
                0.5
            );
        });

        it('+inf', () => {
            assert.equal(
                transformReplyNumberInfinity('+inf'),
                Infinity
            );
        });

        it('-inf', () => {
            assert.equal(
                transformReplyNumberInfinity('-inf'),
                -Infinity
            );
        });
    });

    describe('transformReplyNumberInfinityArray', () => {
        it('empty array', () => {
            assert.deepEqual(
                transformReplyNumberInfinityArray([]),
                []
            );
        });

        it('0.5, +inf, -inf', () => {
            assert.deepEqual(
                transformReplyNumberInfinityArray(['0.5', '+inf', '-inf']),
                [0.5, Infinity, -Infinity]
            );
        });
    });

    describe('transformReplyNumberInfinityNull', () => {
        it('null', () => {
            assert.equal(
                transformReplyNumberInfinityNull(null),
                null
            );
        });

        it('1', () => {
            assert.equal(
                transformReplyNumberInfinityNull('1'),
                1
            );
        });
    });

    describe('transformArgumentNumberInfinity', () => {
        it('0.5', () => {
            assert.equal(
                transformArgumentNumberInfinity(0.5),
                '0.5'
            );
        });

        it('Infinity', () => {
            assert.equal(
                transformArgumentNumberInfinity(Infinity),
                '+inf'
            );
        });

        it('-Infinity', () => {
            assert.equal(
                transformArgumentNumberInfinity(-Infinity),
                '-inf'
            );
        });
    });

    describe('transformArgumentStringNumberInfinity', () => {
        it("'0.5'", () => {
            assert.equal(
                transformArgumentStringNumberInfinity('0.5'),
                '0.5'
            );
        });

        it('0.5', () => {
            assert.equal(
                transformArgumentStringNumberInfinity(0.5),
                '0.5'
            );
        });
    });

    it('transformReplyStringTuples', () => {
        assert.deepEqual(
            transformReplyStringTuples(['key1', 'value1', 'key2', 'value2']),
            Object.create(null, {
                key1: {
                    value: 'value1',
                    configurable: true,
                    enumerable: true
                },
                key2: {
                    value: 'value2',
                    configurable: true,
                    enumerable: true
                }
            })
        );
    });

    it('transformReplyBufferTuples', () => {
        assert.deepEqual(
            transformReplyBufferTuples([Buffer.from('key1'), Buffer.from('value1'), Buffer.from('key2'), Buffer.from('value2')]),
            Object.create(null, {
                key1: {
                    value: Buffer.from('value1'),
                    configurable: true,
                    enumerable: true
                },
                key2: {
                    value: Buffer.from('value2'),
                    configurable: true,
                    enumerable: true
                }
            })
        );
    });

    it('transformReplyStreamStringMessages', () => {
        assert.deepEqual(
            transformReplyStreamStringMessages([['0-0', ['0key', '0value']], ['1-0', ['1key', '1value']]]),
            [{
                id: '0-0',
                message: Object.create(null, {
                    '0key': {
                        value: '0value',
                        configurable: true,
                        enumerable: true
                    }
                })
            }, {
                id: '1-0',
                message: Object.create(null, {
                    '1key': {
                        value: '1value',
                        configurable: true,
                        enumerable: true
                    }
                })
            }]
        );
    });

    it('transformReplyStreamBufferMessages', () => {
        assert.deepEqual(
            transformReplyStreamBufferMessages([
                [Buffer.from('0-0'), [Buffer.from('0key'), Buffer.from('0value')]],
                [Buffer.from('1-0'), [Buffer.from('1key'), Buffer.from('1value')]]
            ]),
            [{
                id: Buffer.from('0-0'),
                message: Object.create(null, {
                    '0key': {
                        value: Buffer.from('0value'),
                        configurable: true,
                        enumerable: true
                    }
                })
            }, {
                id: Buffer.from('1-0'),
                message: Object.create(null, {
                    '1key': {
                        value: Buffer.from('1value'),
                        configurable: true,
                        enumerable: true
                    }
                })
            }]
        );
    });

    describe('transformReplyStreamsStringMessages', () => {
        it('null', () => {
            assert.equal(
                transformReplyStreamsStringMessages(null),
                null
            );
        });

        it('with messages', () => {
            assert.deepEqual(
                transformReplyStreamsStringMessages([['stream1', [['0-1', ['11key', '11value']], ['1-1', ['12key', '12value']]]], ['stream2', [['0-2', ['2key1', '2value1', '2key2', '2value2']]]]]),
                [{
                    name: 'stream1',
                    messages: [{
                        id: '0-1',
                        message: Object.create(null, {
                            '11key': {
                                value: '11value',
                                configurable: true,
                                enumerable: true
                            }
                        })
                    }, {
                        id: '1-1',
                        message: Object.create(null, {
                            '12key': {
                                value: '12value',
                                configurable: true,
                                enumerable: true
                            }
                        })
                    }]
                }, {
                    name: 'stream2',
                    messages: [{
                        id: '0-2',
                        message: Object.create(null, {
                            '2key1': {
                                value: '2value1',
                                configurable: true,
                                enumerable: true
                            },
                            '2key2': {
                                value: '2value2',
                                configurable: true,
                                enumerable: true
                            }
                        })
                    }]
                }]
            );
        });
    });

    describe('transformReplyStreamsBufferMessages', () => {
        it('null', () => {
            assert.equal(
                transformReplyStreamsBufferMessages(null),
                null
            );
        });

        it('with messages', () => {
            assert.deepEqual(
                transformReplyStreamsBufferMessages([
                    [
                        Buffer.from('stream1'),
                        [
                            [Buffer.from('0-1'), [Buffer.from('11key'), Buffer.from('11value')]],
                            [Buffer.from('1-1'), [Buffer.from('12key'), Buffer.from('12value')]]
                        ]
                    ],
                    [
                        Buffer.from('stream2'),
                        [
                            [Buffer.from('0-2'), [Buffer.from('2key1'), Buffer.from('2value1'), Buffer.from('2key2'), Buffer.from('2value2')]]
                        ]
                    ]
                ]),
                [{
                    name: Buffer.from('stream1'),
                    messages: [{
                        id: Buffer.from('0-1'),
                        message: Object.create(null, {
                            '11key': {
                                value: Buffer.from('11value'),
                                configurable: true,
                                enumerable: true
                            }
                        })
                    }, {
                        id: Buffer.from('1-1'),
                        message: Object.create(null, {
                            '12key': {
                                value: Buffer.from('12value'),
                                configurable: true,
                                enumerable: true
                            }
                        })
                    }]
                }, {
                    name: Buffer.from('stream2'),
                    messages: [{
                        id: Buffer.from('0-2'),
                        message: Object.create(null, {
                            '2key1': {
                                value: Buffer.from('2value1'),
                                configurable: true,
                                enumerable: true
                            },
                            '2key2': {
                                value: Buffer.from('2value2'),
                                configurable: true,
                                enumerable: true
                            }
                        })
                    }]
                }]
            );
        });
    });

    it('transformReplySortedStringsSetWithScores', () => {
        assert.deepEqual(
            transformReplySortedStringsSetWithScores(['member1', '0.5', 'member2', '+inf', 'member3', '-inf']),
            [{
                value: 'member1',
                score: 0.5
            }, {
                value: 'member2',
                score: Infinity
            }, {
                value: 'member3',
                score: -Infinity
            }]
        );
    });

    it('transformReplySortedBuffersSetWithScores', () => {
        assert.deepEqual(
            transformReplySortedBuffersSetWithScores([
                Buffer.from('member1'),
                Buffer.from('0.5'),
                Buffer.from('member2'),
                Buffer.from('+inf'),
                Buffer.from('member3'),
                Buffer.from('-inf')
            ]),
            [{
                value: Buffer.from('member1'),
                score: 0.5
            }, {
                value: Buffer.from('member2'),
                score: Infinity
            }, {
                value: Buffer.from('member3'),
                score: -Infinity
            }]
        );
    });

    describe('pushGeoCountArgument', () => {
        it('undefined', () => {
            assert.deepEqual(
                pushGeoCountArgument([], undefined),
                []
            );
        });

        it('number', () => {
            assert.deepEqual(
                pushGeoCountArgument([], 1),
                ['COUNT', '1']
            );
        });

        describe('with COUNT', () => {
            it('number', () => {
                assert.deepEqual(
                    pushGeoCountArgument([], 1),
                    ['COUNT', '1']
                );
            });

            describe('object', () => {
                it('value', () => {
                    assert.deepEqual(
                        pushGeoCountArgument([], { value: 1 }),
                        ['COUNT', '1']
                    );
                });

                it('value, ANY', () => {
                    assert.deepEqual(
                        pushGeoCountArgument([], {
                            value: 1,
                            ANY: true
                        }),
                        ['COUNT', '1', 'ANY']
                    );
                });
            });
        });
    });

    describe('pushGeoSearchArguments', () => {
        it('FROMMEMBER, BYRADIUS', () => {
            assert.deepEqual(
                pushGeoSearchArguments([], 'key', 'member', {
                    radius: 1,
                    unit: 'm'
                }),
                ['key', 'FROMMEMBER', 'member', 'BYRADIUS', '1', 'm']
            );
        });

        it('FROMLONLAT, BYBOX', () => {
            assert.deepEqual(
                pushGeoSearchArguments([], 'key', {
                    longitude: 1,
                    latitude: 2
                }, {
                    width: 1,
                    height: 2,
                    unit: 'm'
                }),
                ['key', 'FROMLONLAT', '1', '2', 'BYBOX', '1', '2', 'm']
            );
        });

        it('with SORT', () => {
            assert.deepEqual(
                pushGeoSearchArguments([], 'key', 'member', {
                    radius: 1,
                    unit: 'm'
                }, {
                    SORT: 'ASC'
                }),
                ['key', 'FROMMEMBER', 'member', 'BYRADIUS', '1', 'm', 'ASC']
            );
        });
    });

    describe('transformGeoMembersWithReply', () => {
        it('DISTANCE', () => {
            assert.deepEqual(
                transformGeoMembersWithReply([
                    [
                        '1',
                        '2'
                    ],
                    [
                        '3',
                        '4'
                    ]
                ], [GeoReplyWith.DISTANCE]),
                [{
                    member: '1',
                    distance: '2'
                }, {
                    member: '3',
                    distance: '4'
                }]
            );
        });

        it('HASH', () => {
            assert.deepEqual(
                transformGeoMembersWithReply([
                    [
                        '1',
                        2
                    ],
                    [
                        '3',
                        4
                    ]
                ], [GeoReplyWith.HASH]),
                [{
                    member: '1',
                    hash: 2
                }, {
                    member: '3',
                    hash: 4
                }]
            );
        });

        it('COORDINATES', () => {
            assert.deepEqual(
                transformGeoMembersWithReply([
                    [
                        '1',
                        [
                            '2',
                            '3'
                        ]
                    ],
                    [
                        '4',
                        [
                            '5',
                            '6'
                        ]
                    ]
                ], [GeoReplyWith.COORDINATES]),
                [{
                    member: '1',
                    coordinates: {
                        longitude: '2',
                        latitude: '3'
                    }
                }, {
                    member: '4',
                    coordinates: {
                        longitude: '5',
                        latitude: '6'
                    }
                }]
            );
        });

        it('DISTANCE, HASH, COORDINATES', () => {
            assert.deepEqual(
                transformGeoMembersWithReply([
                    [
                        '1',
                        '2',
                        3,
                        [
                            '4',
                            '5'
                        ]
                    ],
                    [
                        '6',
                        '7',
                        8,
                        [
                            '9',
                            '10'
                        ]
                    ]
                ], [GeoReplyWith.DISTANCE, GeoReplyWith.HASH, GeoReplyWith.COORDINATES]),
                [{
                    member: '1',
                    distance: '2',
                    hash: 3,
                    coordinates: {
                        longitude: '4',
                        latitude: '5'
                    }
                }, {
                    member: '6',
                    distance: '7',
                    hash: 8,
                    coordinates: {
                        longitude: '9',
                        latitude: '10'
                    }
                }]
            );
        });
    });

    describe('transformEXAT', () => {
        it('number', () => {
            assert.equal(
                transformEXAT(1),
                '1'
            );
        });

        it('date', () => {
            const d = new Date();
            assert.equal(
                transformEXAT(d),
                Math.floor(d.getTime() / 1000).toString()
            );
        });
    });

    describe('transformPXAT', () => {
        it('number', () => {
            assert.equal(
                transformPXAT(1),
                '1'
            );
        });

        it('date', () => {
            const d = new Date();
            assert.equal(
                transformPXAT(d),
                d.getTime().toString()
            );
        });
    });

    describe('pushEvalArguments', () => {
        it('empty', () => {
            assert.deepEqual(
                pushEvalArguments([]),
                ['0']
            );
        });

        it('with keys', () => {
            assert.deepEqual(
                pushEvalArguments([], {
                    keys: ['key']
                }),
                ['1', 'key']
            );
        });

        it('with arguments', () => {
            assert.deepEqual(
                pushEvalArguments([], {
                    arguments: ['argument']
                }),
                ['0', 'argument']
            );
        });

        it('with keys and arguments', () => {
            assert.deepEqual(
                pushEvalArguments([], {
                    keys: ['key'],
                    arguments: ['argument']
                }),
                ['1', 'key', 'argument']
            );
        });
    });

    describe('pushStringTuplesArguments', () => {
        it("['key1', 'value1', 'key2', 'value2']", () => {
            assert.deepEqual(
                pushStringTuplesArguments([], ['key1', 'value1', 'key2', 'value2']),
                ['key1', 'value1', 'key2', 'value2']
            );
        });

        it("[['key1', 'value1'], ['key2', 'value2']]", () => {
            assert.deepEqual(
                pushStringTuplesArguments([], [['key1', 'value1'], ['key2', 'value2']]),
                ['key1', 'value1', 'key2', 'value2']
            );
        });

        it("{key1: 'value1'. key2: 'value2'}", () => {
            assert.deepEqual(
                pushStringTuplesArguments([], { key1: 'value1', key2: 'value2' }),
                ['key1', 'value1', 'key2', 'value2']
            );
        });
    });

    describe('pushVerdictArguments', () => {
        it('string', () => {
            assert.deepEqual(
                pushVerdictArguments([], 'string'),
                ['string']
            );
        });

        it('array', () => {
            assert.deepEqual(
                pushVerdictArguments([], ['1', '2']),
                ['1', '2']
            );
        });
    });

    describe('pushVerdictArgument', () => {
        it('string', () => {
            assert.deepEqual(
                pushVerdictArgument([], 'string'),
                ['1', 'string']
            );
        });

        it('array', () => {
            assert.deepEqual(
                pushVerdictArgument([], ['1', '2']),
                ['2', '1', '2']
            );
        });
    });

    describe('pushOptionalVerdictArgument', () => {
        it('undefined', () => {
            assert.deepEqual(
                pushOptionalVerdictArgument([], 'name', undefined),
                []
            );
        });

        it('string', () => {
            assert.deepEqual(
                pushOptionalVerdictArgument([], 'name', 'string'),
                ['name', '1', 'string']
            );
        });

        it('array', () => {
            assert.deepEqual(
                pushOptionalVerdictArgument([], 'name', ['1', '2']),
                ['name', '2', '1', '2']
            );
        });
    });

    it('transformCommandReply', () => {
        assert.deepEqual(
            transformCommandReply([
                'ping',
                -1,
                [CommandFlags.STALE, CommandFlags.FAST],
                0,
                0,
                0,
                [CommandCategories.FAST, CommandCategories.CONNECTION]
            ]),
            {
                name: 'ping',
                arity: -1,
                flags: new Set([CommandFlags.STALE, CommandFlags.FAST]),
                firstKeyIndex: 0,
                lastKeyIndex: 0,
                step: 0,
                categories: new Set([CommandCategories.FAST, CommandCategories.CONNECTION])
            }
        );
    });
});