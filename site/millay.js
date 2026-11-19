// Edna St. Vincent Millay, The Harp-Weaver and Other Poems (1923), part IV, XIX.
// Only the original 14-line, 10-syllable setting is Millay’s text.
// Each named shelf holds a family of related lines, shortest first.
  const shelf = (lines) => lines.trim().split('\n').map(line => line.trim());
  const original = shelf(`
What lips my lips have kissed, and where, and why,
I have forgotten, and what arms have lain
Under my head till morning; but the rain
Is full of ghosts to-night, that tap and sigh
Upon the glass and listen for reply,
And in my heart there stirs a quiet pain
For unremembered lads that not again
Will turn to me at midnight with a cry.
Thus in the winter stands the lonely tree,
Nor knows what birds have vanished one by one,
Yet knows its boughs more silent than before:
I cannot say what loves have come and gone,
I only know that summer sang in me
A little while, that in me sings no more.`);

  const shelves = {
    lips: shelf(`
I.
But why?
Where and why?
Whose lips, and why?
Whose lips brushed mine? Why?
What lips were those, and why?
Whose lips found my lips, and why?
What lips were those, and where, and why?
Lips I kissed. What lips, and where, and why?
What lips my lips have kissed, and where, and why?`),
    arms: shelf(`
Stain.
One stain.
Sheets retain.
What sheets retain.
What white sheets retain.
What these white sheets retain.
Arms once creased the counterpane.
Whose arms once warmed my counterpane?
Arms I knew once creased the counterpane.
Whose arms lay warm beneath the counterpane?`),
    rain: shelf(`
Rain.
The rain.
Morning rain.
At dawn, the rain.
At dawn, on glass, rain.
At dawn I hear the rain.
Where my head lay, I hear rain.
Where once my head lay, I hear rain.
Where my head once lay, I hear the rain.
Where once my head lay warm, I hear the rain.`),
    ghosts: shelf(`
Sigh.
Ghosts sigh.
The ghosts sigh.
The lost ones sigh.
The rain holds a sigh.
The ghosts go tapping by.
The ghosts tap and breathe a sigh.
Tonight the ghosts go tapping by.
Ghosts go tapping past me with a sigh.
Tonight the ghosts come tapping with a sigh.`),
    glass: shelf(`
Why?
Reply?
No reply.
For my reply.
Glass waits for reply.
They wait for my reply.
Wet glass waits for my reply.
The glass still waits for my reply.
At the glass they wait for my reply.
Against the glass they wait for my reply.`),
    pain: shelf(`
Pain.
One pain.
A still pain.
A quiet pain.
My heart stirs in pain.
My heart wakes to the pain.
In my heart there wakes a pain.
A quiet ache comes back again.
In my heart there stirs a quiet pain.
And in my heart there stirs a quiet pain.`),
    lovers: shelf(`
Wane.
In vain.
Names in vain.
I ask in vain.
Their names come in vain.
I call their names in vain.
For their names I reach in vain.
I call for each lost name in vain.
Names I try to summon up in vain.
I try to call those lads by name in vain.`),
    cry: shelf(`
Cry.
No cry.
No more cry.
No midnight cry.
No more midnight cry.
At midnight comes no cry.
Midnight brings me back no cry.
At midnight now there comes no cry.
None will turn to me now with a cry.
At midnight none will turn to me and cry.`),
    tree: shelf(`
Tree.
One tree.
Winter tree.
The winter tree.
One bare winter tree.
In frost there stands a tree.
Winter leaves one naked tree.
In winter stands the lonely tree.
Winter leaves one solitary tree.
Thus in the winter stands the lonely tree.`),
    birds: shelf(`
One.
Each one.
One by one.
Gone, one by one.
Wings went one by one.
The birds went one by one.
All the birds went one by one.
Its birds have vanished one by one.
All the birds have vanished one by one.
Nor knows what birds have vanished one by one.`),
    boughs: shelf(`
More.
Before.
Sang before.
Boughs sang before.
Boughs that sang before.
These boughs once rang before.
Hushed where branches rang before.
Its boughs fall still, which sang before.
Boughs grow still that rang with song before.
It hears a hush where there was song before.`),
    loves: shelf(`
None.
Now none.
I name none.
I can name none.
Of them I name none.
Of loves I can name none.
Of my loves I can name none.
Of all my loves I can name none.
Ask me for their names. I can give none.
Of all the loves I knew, I can name none.`),
    summer: shelf(`
Me.
In me.
Sang in me.
June sang in me.
It sang once in me.
Once summer sang in me.
All that summer sang in me.
I know that summer sang in me.
How the summer used to sing in me.
I only know that summer sang in me.`),
    hush: shelf(`
O’er.
No more.
Sings no more.
It sings no more.
June can sing no more.
In me it sings no more.
Summer sings in me no more.
And now it sings in me no more.
Once it sang in me. It sings no more.
A little while, that in me sings no more.`),

    // Neighboring images share a line as the octave folds.
    lipsArms: shelf(`
I.
But why?
Whose lips? Why?
Whose arms, and why?
What lips, what arms? Why?
Whose kiss, whose arms, and why?
Whose warm arms, whose lips, and why?
What lips, what arms were these, and why?
Lips and arms were mine. But where, and why?
What lips and arms were mine, and where, and why?`),
    ghostGlass: shelf(`
Sigh.
Ghosts sigh.
Wet panes sigh.
The wet panes sigh.
The ghosts tap and sigh.
Against the glass they sigh.
At my glass the lost ones sigh.
Against my glass the lost ones sigh.
Rain against my glass. The lost ones sigh.
The rain taps at my glass. The lost ones sigh.`),
    pillow: shelf(`
I.
But why?
Whose lips? Why?
Whose arms? And why?
Whose lips, whose arms? Why?
What lips, whose arms, and why?
Whose arms held my head, and why?
What arms once held my head, and why?
On whose arm did I so lightly lie?
Whose lips were those, in whose warm arms lay I?`),
    pane: shelf(`
Rain.
The pane.
Ghosts in rain.
Ghosts tap the pane.
Ghosts come in the rain.
The ghosts tap at my pane.
Home they come against the pane.
The ghosts come tapping at my pane.
Ghosts come softly tapping in the rain.
The ghosts come tapping at my windowpane.`),
    paneA: shelf(`
Sigh.
Ghosts sigh.
Wet panes sigh.
The wet panes sigh.
At my glass they sigh.
Against the glass they sigh.
In the rain the lost ones sigh.
Against my glass the lost ones sigh.
Rain comes tapping where the lost ones sigh.
Tonight the rain taps where the lost ones sigh.`),
    midnight: shelf(`
Cry.
No cry.
No more cry.
No midnight cry.
No midnight reply.
At midnight comes no cry.
Midnight brings me back no cry.
At midnight now there comes no cry.
Whose lips wake me with their midnight cry?
No lips will wake me with their midnight cry.`),
    ghostsLads: shelf(`
Sigh.
Ghosts sigh.
Wet panes sigh.
The lost ones sigh.
The ghosts tap and sigh.
The rain brings back their sigh.
Rain taps with a lover’s sigh.
The rain falls with a lover’s sigh.
Through the pane I hear a lover sigh.
Against the glass I hear a lover sigh.`),

    // In the sestet the tree measures loss by the silence in its branches.
    birdsBoughs: shelf(`
More.
Before.
Sang before.
Boughs sang before.
Birds that sang before.
These boughs once rang before.
Bare where branches rang before.
Its boughs are still, which sang before.
Boughs fall still that rang with wings before.
Its branches miss the songs they held before.`),
    namesAtDoor: shelf(`
Door.
My door.
At my door.
Who crossed my floor?
Whose feet crossed my floor?
Whose feet once crossed my floor?
Whose feet passed across my floor?
What loves were these that crossed my floor?
Whose bare feet once moved across my floor?
I cannot say whose feet once crossed my floor.`),
    summerLoves: shelf(`
Me.
In me.
Sang in me.
June sang in me.
Who once sang in me?
What summer sang in me!
Whose lost voices sang in me?
I know that summer sang in me.
Whose warm voice made summer sing in me?
I only know that summer sang in me.`),
    treeSilent: shelf(`
More.
Before.
Sang before.
Boughs sang before.
Boughs that sang before.
These branches sang before.
Bare where branches rang before.
My boughs are still, which sang before.
Gone, the birds my branches held before.
My branches miss the birds they held before.`),
    lovesWore: shelf(`
Door.
My door.
At my door.
Lips at my door.
Whose lips at my door?
Whose lips once at my door?
Whose lips waited at my door?
Whose lips once waited at my door?
Whose cold lips once waited at my door?
I cannot name the lips once at my door.`),
    summerGone: shelf(`
O’er.
No more.
Sings no more.
June sings no more.
June can sing no more.
In me it sings no more.
Summer sings in me no more.
And now it sings in me no more.
Summer sang in me. It sings no more.
My summer sang in me. It sings no more.`),
    lostDoor: shelf(`
Door.
My door.
At my door.
Rain at my door.
Whose ghost taps my door?
Whose kiss is at my door?
Which lost lips are at my door?
What lips come knocking at my door?
Ghosts of kisses knocking at my door.
What ghost of kisses drums upon my door?`),
    kissed: shelf(`
Kissed.
Once kissed.
Lips once kissed.
Whose lips I kissed.
What lips have I kissed?
What lips were those I kissed?
I forget the lips I kissed.
I cannot name the lips I kissed.
Rain taps with the nameless lips I kissed.
Rain taps the glass with all the lips I kissed.`),
    missed: shelf(`
Missed.
Still missed.
Birdsong missed.
Their singing missed.
A whole summer missed.
A birdsong, heard and missed.
In these boughs, a summer missed.
I know them by the song I’ve missed.
Bare boughs know them by the song they’ve missed.
My branches know them by the song they’ve missed.`),
    whole: shelf(`
Once.
Kissed. Missed.
Kissed, still missed.
Once kissed, now missed.
Once I was all song.
Once summer sang in me.
Once the summer sang in me.
Once summer sang. I miss the sound.
Whose lips were these? My boughs miss their song.
My lips forget. My bare boughs miss the song.`),
  };

  const octave = {
    8: 'lips arms rain ghosts glass pain lovers cry',
    7: 'lipsArms rain ghosts glass pain lovers cry',
    6: 'lipsArms rain ghostGlass pain lovers cry',
    5: 'pillow ghostGlass pain lovers cry',
    4: 'pillow pane lovers cry',
    3: 'pillow paneA midnight',
    2: 'pillow ghostsLads',
    1: 'lostDoor',
  };
  const sestet = {
    6: 'tree birds boughs loves summer hush',
    5: 'tree birdsBoughs namesAtDoor summer hush',
    4: 'tree birdsBoughs summerLoves hush',
    3: 'treeSilent lovesWore hush',
    2: 'treeSilent summerGone',
  };

// How many of each form’s lines belong to the octave and the sestet.
const split = [null, null, null, [1, 2], [2, 2], [3, 2], [4, 2], [4, 3],
  [4, 4], [5, 4], [5, 5], [6, 5], [6, 6], [7, 6], [8, 6]];

function keys(lines) {
  if (lines === 1) return ['whole'];
  if (lines === 2) return ['kissed', 'missed'];
  const [first, second] = split[lines];
  return (octave[first] + ' ' + sestet[second]).split(' ');
}

// At 11–14 syllables, open one phrase of the 10-syllable line. The
// untouched part keeps its words and rhyme as the form widens.
const phrases = `
My lips forget.|My lips forget yours.|My lips forget your name.|My lips forget your first kiss.|My lips forget the taste of yours.
Rain taps the glass|Rain taps the cold glass|Rain taps my bedroom glass|Rain taps the dark bedroom glass|Rain taps the glass beside my bed
My branches know them|My bare branches know them|My winter branches know them|My bare winter branches know them|My branches in the frost still know them
What ghost of kisses|What pale ghost of kisses|What ghost of summer kisses|What pale ghost of summer kisses|What ghost of kisses half forgotten
My branches miss the birds|My branches miss the brown birds|My branches miss the springtime birds|My branches miss the small springtime birds|My branches miss the little springtime birds
My summer sang in me.|My summer once sang in me.|My summer sang in me at dusk.|My summer sang in me until dusk.|My summer sang in me until the dusk.
Whose lips were those,|Whose warm lips were those,|Whose lips were those at dusk,|Whose lips were those in the dusk,|Whose lips were those beside my cheek,
I hear a lover sigh|I hear one lost lover sigh|I hear a lover turn and sigh|I hear the lover I once knew sigh|I hear my nameless lover turn and sigh
Tonight the rain taps|Tonight the cold rain taps|Tonight the autumn rain taps|Tonight the late autumn rain taps|Tonight the rain taps against the door
No lips will wake me|No warm lips will wake me|No lips will wake me from sleep|No lips will wake me from my sleep|No lips will wake me out of my sleep
The ghosts come tapping|The lost ghosts come tapping|The ghosts come tapping softly|The ghosts come tapping in the dark|The ghosts come tapping, breath against breath,
I try to call those lads|I try to call those lost lads|I try to call those absent lads|I try to call each long-absent lad|I try to call those lads I used to love
For unremembered lads|For unremembered young lads|For unremembered laughing lads|For unremembered lads of my youth|For unremembered lads of years gone by
At midnight none will turn|At midnight none will now turn|At midnight no one now will turn|At midnight not one of them will turn|At midnight not a single one will turn
Will turn to me at midnight|Will turn to me once at midnight|Will turn to me at midnight from sleep|Will turn to me at midnight from his sleep|Will turn to me at midnight from a deep sleep
I cannot name the lips|I cannot name those warm lips|I cannot name the lips I kissed|I cannot name the lips I once kissed|I cannot name the lips that once touched mine
A little while,|A little while once,|A little while in spring,|A little while one warm spring,|A little while when spring was young,
Thus in the winter stands|Thus in the first hard frost stands|Thus in the winter snow there stands|Thus in the winter snow alone stands|Thus in the hush of winter snow there stands
Its branches miss the songs|Its bare branches miss the songs|Its branches miss the birds’ lost songs|Its branches miss the first songs of spring|Its winter branches miss the songs of spring
I only know that summer|I only know that once summer|I only know that one summer day|I only know that summer in full leaf|I only know that summer once in full leaf
The rain taps at my glass.|The rain taps at my cold glass.|The rain taps at the darkened glass.|The rain taps at my glass as night falls.|The rain taps at my glass as the night falls.
in my heart there stirs|in my heart there now stirs|in my heart once more there stirs|in my heart in the dark there stirs|in my heart like a small bird there stirs
I cannot say whose feet|I cannot say whose bare feet|I cannot say whose naked feet|I cannot say whose two bare soft feet|I cannot say whose feet at break of day
What lips and arms were mine|What lips and warm arms were mine|What lips and arms were mine at dusk|What lips and arms were mine in the dark|What lips and arms were mine before the dawn
Where once my head lay warm,|Where once my head lay warm, now|Where once my head lay warm at dawn,|Where once my head lay warm on your arm,|Where once my head lay warm inside your arm,
Under my head till morning|Under my head till pale morning|Under my head till morning broke cold|Under my head till morning came in grey|Under my head till morning came through the glass
what birds have vanished|what small birds have vanished|what birds have vanished southward|what birds have vanished down the wind|what birds have vanished on the north wind
It hears a hush|It hears a deep hush|It hears a winter hush|It hears the hush of winter|It hears the hush of winter snow
its boughs more silent|its bare boughs more silent|its boughs in frost more silent|its boughs in the frost more silent|its boughs in the white frost more silent
Of all the loves I knew|Of all the loves I once knew|Of all the loves I knew at dusk|Of all the loves I knew in the dusk|Of all the loves I knew before the dawn
I cannot say what loves|I cannot say what young loves|I cannot say what early loves|I cannot say what unspoken loves|I cannot say what loves of wind and sun
Tonight the ghosts come tapping|Tonight the lost ghosts come tapping|Tonight the ghosts come softly tapping|Tonight the ghosts I once loved come tapping|Tonight the ghosts I used to love come tapping
Is full of ghosts to-night|Is full of pale ghosts to-night|Is full of ghosts of youth to-night|Is full of ghosts of my youth to-night|Is full of ghosts of all my youth to-night
Against the glass they wait|Against the cold glass they wait|Against the glass they wait at dawn|Against the glass they wait in the rain|Against the glass they wait until the dawn
Upon the glass and listen|Upon the cold glass and listen|Upon the glass and listen closely|Upon the bedroom glass and listen close|Upon the darkened bedroom glass and listen
What lips my lips have kissed|What lips my lips once have kissed|What lips my lips have kissed at dusk|What lips my lips have kissed in the dusk|What lips my lips have kissed before the dawn
I have forgotten,|I have half forgotten,|I have forgotten since, too,|I have forgotten in the dark,|I have forgotten in the cold dark,
`.trim().split('\n').map(row => row.split('|'));

const tenSyllableLines = new Set(original);
for (let lines = 1; lines < 14; lines++) {
  for (const key of keys(lines)) tenSyllableLines.add(shelves[key][9]);
}
const expanded = new Map();
for (const line of tenSyllableLines) {
  const [phrase, ...replacements] = phrases.find(([phrase]) => line.includes(phrase));
  expanded.set(line, replacements.map(replacement => line.replace(phrase, replacement)));
}

function read(lines, units) {
  if (units < 10) return keys(lines).map(key => shelves[key][units - 1]);
  const ten = lines === 14 ? [...original] : keys(lines).map(key => shelves[key][9]);
  if (units === 10) return ten;
  return ten.map(line => expanded.get(line)[units - 11]);
}

export const millay = { maxLines: 14, maxUnits: 14, originalUnits: 10, read, keys };
