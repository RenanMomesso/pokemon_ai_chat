# Design Decisions

I've implemented design features that make the chatbot user-friendly and enjoyable to use, tried to implement all edge-cases errors and easy to any new developer read any file and understand what's going on or how to use it. 
I've used React Native with Expo because it work both on IOS and Android, without having to write twice, it's easy to deploy and we can use different features now and implement others later.
I've structured the project in a way that makes it easy to add new features, like the Pokémon tools, and keep the code maintainable,
used ContextAPI for state managament because it's easy to use and understand, and it's a good fit for this project as it's not a big project.
Custom Hooks for keeping the code clean and reusable.
Custom Components for keeping the code clean and reusable.
Used TypeScript for type safety and better development experience.
Used React Query for data fetching and caching

## Challenges
- Getting real-time streaming from the AI API while maintaining a smooth UI was harder than expected. The responses would sometimes come in weird chunks and it was my first time working with streaming
- The pokeApi doesn't have a lot of documentation, so I had to figure out the best way to use it
- Tried to implement network errors, API failures, and other edge cases to handle error's in the system with a user-friendly message


## 1-Month Roadmap
 - Add more tools to the AI, like the ability to search the internet
 - Add more features to the app, like the ability to save conversations and favorite Pokémon
 - Add more features to the AI, like the ability to remember previous conversations and user preferences
 - Add features like generate image for each pokemon, performance optomization when scrolling long chat histories, add more tools to the AI, like the ability to search the internet, and more
 - Add features like AR, voice generator, image recognization of each pokemon, battles of pokemon and etc


## Final Thoughts
 - It was a good project where I've learned a lot of things, it was pretty easy to develop knowing the idea and the tools, but when I started to implement the features, I started to think about the performance and the user experience, and things i've could added but this would take much longer, also always respecting the application architeture thinking on modularity, performance, maintability and following SOLID principles