/************************************************************************************************
 * JavaScript Version:  Copyright (c) 2012 Sangwhan Moon (https://github.com/cynthia/mt.js)     *
 * NOTE: Not recommended for scientific purposes due to how the range limiting works.           *
 *                                                                                              *
 * Based on C# Version: Copyright (C) 2001-2004 Akihilo Kramot (Takel).                         *
 * C# porting from a C-program for MT19937, originaly coded by:                                 *
 * Takuji Nishimura, considering the suggestions by Topher Cooper and Marc Rieffel, 1997.       *
 * This library is free software under the Artistic license.                                    *
 *                                                                                              *
 * You can find the original C-program at  - http://www.math.keio.ac.jp/~matumoto/mt.html       *
 ************************************************************************************************/

var MersenneTwister = function() {

    // Period parameters

    var N = 624;
    var M = 397;

    var MATRIX_A   = 0x9908b0df; // Constant vector
    var UPPER_MASK = 0x80000000; // Most significant w-r bits
    var LOWER_MASK = 0x7fffffff; // Least significant r bits

    // Tempering parameters

    var TEMPERING_MASK_B = 0x9d2c5680;
    var TEMPERING_MASK_C = 0xefc60000;

    var TEMPERING_SHIFT_U = function(y) { return (y >> 11); }
    var TEMPERING_SHIFT_S = function(y) { return (y <<  7); }
    var TEMPERING_SHIFT_T = function(y) { return (y << 15); }
    var TEMPERING_SHIFT_L = function(y) { return (y >> 18); }

    var RAND_MAX = 2147483648;

    var mt = [];
    var mti = 0;
    var mag01 = [0x0, MATRIX_A];

    this.init = function(seed) {

        if (!seed)
        {
            // 4357 is what is used in the reference implementation, but for the sake of
            // simplicity we'll seed based on millisecond timestamps.

            // seed = 4357;

            seed = new Date().getTime();

        }

        mt[0] = seed & 0xffffffff;

        for (mti = 1; mti < N; mti++)
            mt[mti] = (69069 * mt[mti - 1]) & 0xffffffff

    };

    this.generateUInt = function() {

        var y;

        // mag01[x] = x * MATRIX_A  for x=0,1
        if (mti >= N) // generate N words at one time
        {
            var kk = 0;

            for (; kk < N - M; ++kk)
            {
                y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
                mt[kk] = mt[kk + M] ^ (y >> 1) ^ mag01[y & 0x1];
            }

            for(;kk < N - 1; ++kk)
            {
                y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
                mt[kk] = mt[kk+(M - N)] ^ (y >> 1) ^ mag01[y & 0x1];
            }

            y = (mt[N - 1] & UPPER_MASK) | (mt[0] & LOWER_MASK);
            mt[N - 1] = mt[M - 1] ^ (y >> 1) ^ mag01[y & 0x1];

            mti = 0;
        }

        y = mt[mti++];
        y ^= TEMPERING_SHIFT_U(y);
        y ^= TEMPERING_SHIFT_S(y) & TEMPERING_MASK_B;
        y ^= TEMPERING_SHIFT_T(y) & TEMPERING_MASK_C;
        y ^= TEMPERING_SHIFT_L(y);

        return y;

    };

    this.nextInt = function(p1, p2) {

        // To provide the exact functionality the original implementation provides,
        // we use generic terms of p1 (first parameter) and p2 (second parameter)
        // as a workaround for JavaScript's limitations. Unlike the original code,
        // min and max is position independent.

        if (!p1 && !p2)
            return this.generateUInt();

        else if (!p2) // If parameter 2 is unspecified, assume p1 is for max
        {
            if (p1 == 0)
                return p1;

            return Math.floor(this.generateUInt() % p1);
        }

        else
        {
            if (p1 == p2)
                return p1;

            var real_min = Math.min(p1, p2);
            var real_max = Math.max(p1, p2);

            return Math.floor((this.generateUInt() % real_max) + real_min);
        }

        return 0; // Should not come here

    };

    this.next = function(p1, p2) {

        // See comments in implementation of MersenneTwister.nextInt() for details.

        if (!p1 && !p2)
            return this.nextDouble();

        else if (!p2) // If parameter 2 is unspecified, assume p1 is for max
        {
            if (p1 <= 0)
                return 0;

            return (this.nextDouble() * p1);
        }

        else
        {
            if (p1 == p2)
                return p1;

            var real_min = Math.min(p1, p2);
            var real_max = Math.max(p1, p2);


            return ((this.nextDouble() * (real_max - real_min)) + real_min);
        }

        return 0; // Should not come here

    };

    this.nextDouble = function() {

        return this.generateUInt() / (RAND_MAX + 1);

    };

};
