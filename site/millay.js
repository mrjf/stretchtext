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

const originalUnits = 10;

function read(lines, units) {
  // Readers may have saved a width from the earlier, expanded edition.
  const width = Math.min(units, originalUnits);
  if (lines === original.length && width === originalUnits) return [...original];
  return keys(lines).map(key => shelves[key][width - 1]);
}

export const millay = { maxLines: original.length, maxUnits: originalUnits, originalUnits, read, keys };
